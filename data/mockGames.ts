export type UserGameState = 'in' | 'out' | 'none';

export type GameStatus = 'OPEN' | 'PLAYED' | 'FULL';

export type MockGame = {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Short weekday label, e.g. SUN */
  day: string;
  /** Day-of-month + month, e.g. 20 SEP */
  dateShort: string;
  /** Combined editorial date, e.g. SUN 20 SEP */
  dateLabel: string;
  /** Compact list date, e.g. SUN · 20 SEP */
  listDate: string;
  /** Display time range, e.g. 4—6 */
  timeRange: string;
  period: 'AM' | 'PM';
  venue: string;
  court: string;
  /** e.g. Intermediate doubles */
  formatLevel: string;
  /** e.g. Court 03 · Intermediate doubles */
  detail: string;
  playersCurrent: number;
  playersMax: number;
  /** HKD integer */
  price: number;
  status: GameStatus;
  joined: boolean;
  currentUserState: UserGameState;
  /** Whether this is the Play hero / Games next fixture */
  featured: boolean;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function playersLabel(game: MockGame): string {
  return `${pad2(game.playersCurrent)} / ${pad2(game.playersMax)}`;
}

export function priceLabel(game: MockGame): string {
  return `HK$${game.price}`;
}

export function remainingSpots(game: MockGame): number {
  return Math.max(0, game.playersMax - game.playersCurrent);
}

export function spotsLabel(game: MockGame): string {
  const left = remainingSpots(game);
  if (left === 0) return 'No spots left';
  if (left === 1) return '1 spot left';
  return `${left} spots left`;
}

export function userStateLabel(game: MockGame): string {
  if (game.status === 'PLAYED') {
    return 'PLAYED';
  }
  if (game.currentUserState === 'in' || game.joined) {
    return "YOU'RE IN";
  }
  if (game.status === 'OPEN') {
    return 'OPEN';
  }
  return game.status;
}

/** Canonical small coherent weekend set — Victoria Park is the featured fixture. */
export const MOCK_GAMES: MockGame[] = [
  {
    id: 'victoria-park-sep20',
    date: '2026-09-26',
    day: 'SAT',
    dateShort: '26 SEP',
    dateLabel: 'SAT 26 SEP',
    listDate: 'SAT · 26 SEP',
    timeRange: '4—6',
    period: 'PM',
    venue: 'Victoria Park',
    court: 'Court 03',
    formatLevel: 'Intermediate doubles',
    detail: 'Court 03 · Intermediate doubles',
    playersCurrent: 3,
    playersMax: 4,
    price: 25,
    status: 'OPEN',
    joined: true,
    currentUserState: 'in',
    featured: true,
  },
  {
    id: 'kowloon-cricket-sep21',
    date: '2026-09-27',
    day: 'SUN',
    dateShort: '27 SEP',
    dateLabel: 'SUN 27 SEP',
    listDate: 'SUN · 27 SEP',
    timeRange: '10—12',
    period: 'AM',
    venue: 'Kowloon Cricket Club',
    court: 'Court 02',
    formatLevel: 'Beginner / intermediate',
    detail: 'Court 02 · Beginner / intermediate',
    playersCurrent: 2,
    playersMax: 4,
    price: 25,
    status: 'OPEN',
    joined: false,
    currentUserState: 'out',
    featured: false,
  },
  {
    id: 'happy-valley-sep21',
    date: '2026-09-27',
    day: 'SUN',
    dateShort: '27 SEP',
    dateLabel: 'SUN 27 SEP',
    listDate: 'SUN · 27 SEP',
    timeRange: '4—6',
    period: 'PM',
    venue: 'Happy Valley',
    court: 'Court 01',
    formatLevel: 'Intermediate singles',
    detail: 'Court 01 · Intermediate singles',
    playersCurrent: 1,
    playersMax: 2,
    price: 30,
    status: 'OPEN',
    joined: false,
    currentUserState: 'out',
    featured: false,
  },
  {
    id: 'happy-valley-sep13',
    date: '2026-09-19',
    day: 'SAT',
    dateShort: '19 SEP',
    dateLabel: 'SAT 19 SEP',
    listDate: 'SAT · 19 SEP',
    timeRange: '4—6',
    period: 'PM',
    venue: 'Happy Valley',
    court: 'Court 01',
    formatLevel: 'Intermediate singles',
    detail: 'Court 01 · Intermediate singles',
    playersCurrent: 2,
    playersMax: 2,
    price: 30,
    status: 'PLAYED',
    joined: true,
    currentUserState: 'in',
    featured: false,
  },
  {
    id: 'victoria-park-sep07',
    date: '2026-09-13',
    day: 'SUN',
    dateShort: '13 SEP',
    dateLabel: 'SUN 13 SEP',
    listDate: 'SUN · 13 SEP',
    timeRange: '4—6',
    period: 'PM',
    venue: 'Victoria Park',
    court: 'Court 04',
    formatLevel: 'Intermediate doubles',
    detail: 'Court 04 · Intermediate doubles',
    playersCurrent: 4,
    playersMax: 4,
    price: 25,
    status: 'PLAYED',
    joined: true,
    currentUserState: 'in',
    featured: false,
  },
];


export type CreateGameInput = {
  venue: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** 24h HH:MM */
  startTime: string;
  /** 24h HH:MM */
  endTime: string;
  court: string;
  format: string;
  level: string;
  maxPlayers: number;
  entryPrice: number;
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

function parseLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Local calendar YYYY-MM-DD for "now" (device timezone). */
export function todayLocalIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

/** True when ISO date is today or a future local calendar day. */
export function isIsoDateTodayOrLater(isoDate: string): boolean {
  return isoDate.trim() >= todayLocalIso();
}

function hour12FromHHMM(hhmm: string): number {
  const h = Number(hhmm.split(':')[0] ?? 0);
  const mod = h % 12;
  return mod === 0 ? 12 : mod;
}

/** Editorial 12h clock fragment — keeps minutes when non-zero (10:30 stays 10:30). */
function timeLabelFromHHMM(hhmm: string): string {
  const [hRaw, mRaw] = hhmm.trim().split(':');
  const hour = hour12FromHHMM(hhmm);
  const minutes = Number(mRaw ?? 0);
  if (!Number.isInteger(minutes) || minutes === 0) return String(hour);
  return `${hour}:${String(minutes).padStart(2, '0')}`;
}

function periodFromHHMM(hhmm: string): 'AM' | 'PM' {
  const h = Number(hhmm.split(':')[0] ?? 0);
  return h >= 12 ? 'PM' : 'AM';
}

function makeLocalId(): string {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Build a MockGame from create-form inputs — one canonical model. */
export function buildGameFromCreate(input: CreateGameInput): MockGame {
  const dt = parseLocalDate(input.date);
  const day = WEEKDAYS[dt.getDay()] ?? 'SUN';
  const dateShort = `${pad2(dt.getDate())} ${MONTHS[dt.getMonth()] ?? 'JAN'}`;
  const dateLabel = `${day} ${dateShort}`;
  const listDate = `${day} · ${dateShort}`;
  const startLabel = timeLabelFromHHMM(input.startTime);
  const endLabel = timeLabelFromHHMM(input.endTime);
  const timeRange = `${startLabel}—${endLabel}`;
  const period = periodFromHHMM(input.startTime);
  const formatLevel = `${input.level.trim()} ${input.format.trim()}`.replace(/\s+/g, ' ').trim();
  const court = input.court.trim();
  const venue = input.venue.trim();

  return {
    id: makeLocalId(),
    date: input.date.trim(),
    day,
    dateShort,
    dateLabel,
    listDate,
    timeRange,
    period,
    venue,
    court,
    formatLevel,
    detail: `${court} · ${formatLevel}`,
    playersCurrent: 1,
    playersMax: input.maxPlayers,
    price: input.entryPrice,
    status: 1 >= input.maxPlayers ? 'FULL' : 'OPEN',
    joined: true,
    currentUserState: 'in',
    featured: false,
  };
}

export const FEATURED_GAME_ID = 'victoria-park-sep20';

export function getGameById(games: MockGame[], id: string): MockGame | undefined {
  return games.find((g) => g.id === id);
}

export function getFeaturedGame(games: MockGame[]): MockGame {
  const featured = games.find((g) => g.featured) ?? games[0];
  return featured;
}

/** Open games for Play “Open games” rows (excludes featured hero). */
export function listPlayOpenGames(games: MockGame[]): MockGame[] {
  return games.filter((g) => g.status === 'OPEN' && !g.featured);
}

/** Upcoming open games for Games list (excludes featured next-fixture; today+ only). */
export function listUpcomingGames(games: MockGame[]): MockGame[] {
  return games.filter(
    (g) => g.status === 'OPEN' && !g.featured && isIsoDateTodayOrLater(g.date),
  );
}

export function listPastGames(games: MockGame[]): MockGame[] {
  return games.filter((g) => g.status === 'PLAYED');
}

/** Header day aligned with featured fixture (resolves SATURDAY vs SUN conflict). */
export function getPlayHeaderDay(games: MockGame[]): string {
  return getFeaturedGame(games).day;
}

export function countOpenGames(games: MockGame[]): number {
  return games.filter((g) => g.status === 'OPEN' && !g.featured).length;
}

export function countUpcomingIncludingFeatured(games: MockGame[]): number {
  return games.filter((g) => g.status === 'OPEN').length;
}
