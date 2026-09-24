import { type MockGame } from '@/data/mockGames';

export type PersonTone = 'dark' | 'green' | 'light';

/** Identity only — counts and history derive from game attendance. */
export type MockPerson = {
  id: string;
  name: string;
  initials: string;
  tone: PersonTone;
  /** Subtle constellation node index for this person. */
  markNode: number;
};

export const CURRENT_USER_ID = 'jeffrey';

export const MOCK_PEOPLE: MockPerson[] = [
  {
    id: 'jeffrey',
    name: 'Jeffrey',
    initials: 'J',
    tone: 'green',
    markNode: 10,
  },
  {
    id: 'alex',
    name: 'Alex',
    initials: 'A',
    tone: 'green',
    markNode: 16,
  },
  {
    id: 'maya',
    name: 'Maya',
    initials: 'M',
    tone: 'dark',
    markNode: 4,
  },
  {
    id: 'daniel',
    name: 'Daniel',
    initials: 'D',
    tone: 'light',
    markNode: 22,
  },
];

/**
 * Who was at each fixture. Includes the current user where joined / in.
 * Keys must match MOCK_GAMES ids — small set, not a social graph.
 * (IDs synced from mockGames on apply.)
 */
export const GAME_ATTENDEES: Record<string, readonly string[]> = {
  'victoria-park-sep20': ['jeffrey', 'alex', 'maya'],
  'kowloon-cricket-sep21': ['alex', 'daniel'],
  'happy-valley-sep21': ['maya'],
  'happy-valley-sep13': ['jeffrey', 'maya'],
  'victoria-park-sep07': ['jeffrey', 'alex', 'maya', 'daniel'],
};

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function getPersonById(id: string): MockPerson | undefined {
  return MOCK_PEOPLE.find((p) => p.id === id);
}

export function getCurrentUser(): MockPerson {
  return getPersonById(CURRENT_USER_ID) ?? MOCK_PEOPLE[0];
}

/** People other than the current user (club roster for "Your people"). */
export function listOtherPeople(): MockPerson[] {
  return MOCK_PEOPLE.filter((p) => p.id !== CURRENT_USER_ID);
}

/**
 * Attendance for a fixture. For live (non-PLAYED) games, current-user
 * membership follows GamesStore joined / currentUserState so leave/join
 * stays coherent across People / Journal / detail.
 */
export function attendeeIdsForGame(gameId: string, game?: MockGame): string[] {
  const base = [...(GAME_ATTENDEES[gameId] ?? [])];
  if (!game || game.status === 'PLAYED') return base;

  const userIn = game.joined || game.currentUserState === 'in';
  const withoutUser = base.filter((id) => id !== CURRENT_USER_ID);
  return userIn ? [...withoutUser, CURRENT_USER_ID] : withoutUser;
}

export function peopleAtGame(gameId: string, games?: MockGame[]): MockPerson[] {
  const game = games?.find((g) => g.id === gameId);
  return attendeeIdsForGame(gameId, game)
    .map((id) => getPersonById(id))
    .filter((p): p is MockPerson => Boolean(p));
}

function sortGamesRecentFirst(games: MockGame[]): MockGame[] {
  return [...games].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.timeRange < b.timeRange ? 1 : -1;
  });
}

/** Games this person played (PLAYED only — attendance map ∩ store games). */
export function gamesForPerson(personId: string, games: MockGame[]): MockGame[] {
  return sortGamesRecentFirst(
    games.filter(
      (g) => g.status === 'PLAYED' && attendeeIdsForGame(g.id, g).includes(personId),
    ),
  );
}

export function placesForPerson(personId: string, games: MockGame[]): string[] {
  const venues = new Set<string>();
  for (const g of gamesForPerson(personId, games)) {
    venues.add(g.venue);
  }
  return [...venues];
}

export function gamesPlayedCount(personId: string, games: MockGame[]): number {
  return gamesForPerson(personId, games).length;
}

export function placesPlayedCount(personId: string, games: MockGame[]): number {
  return placesForPerson(personId, games).length;
}

/** Shared PLAYED fixtures between two people (history only). */
export function sharedGames(
  personA: string,
  personB: string,
  games: MockGame[],
): MockGame[] {
  return sortGamesRecentFirst(
    games.filter((g) => {
      if (g.status !== 'PLAYED') return false;
      const ids = attendeeIdsForGame(g.id, g);
      return ids.includes(personA) && ids.includes(personB);
    }),
  );
}

export function lastSharedGame(
  personA: string,
  personB: string,
  games: MockGame[],
): MockGame | undefined {
  return sharedGames(personA, personB, games)[0];
}

/**
 * People the current user has shared a court with (PLAYED only), ordered by
 * shared-game count (desc), then name. Excludes self.
 */
export function peoplePlayedWith(
  userId: string,
  games: MockGame[],
): MockPerson[] {
  const counts = new Map<string, number>();

  for (const g of games) {
    if (g.status !== 'PLAYED') continue;
    const ids = attendeeIdsForGame(g.id, g);
    if (!ids.includes(userId)) continue;
    for (const id of ids) {
      if (id === userId) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([id, count]) => ({ person: getPersonById(id), count }))
    .filter((row): row is { person: MockPerson; count: number } => Boolean(row.person))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.person.name.localeCompare(b.person.name);
    })
    .map((row) => row.person);
}

/** Others at a fixture (excluding one person). */
export function withPeopleAtGame(
  gameId: string,
  excludePersonId: string,
  games?: MockGame[],
): MockPerson[] {
  return peopleAtGame(gameId, games).filter((p) => p.id !== excludePersonId);
}

export function gamesLabel(count: number): string {
  if (count === 1) return '1 game';
  return `${count} games`;
}

export function fixtureLabel(count: number): string {
  return pad2(count);
}
