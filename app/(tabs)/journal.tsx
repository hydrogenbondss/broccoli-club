import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BroccoliMark } from '@/components/BroccoliMark';
import { Entrance } from '@/components/Entrance';
import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { useGamesStore } from '@/context/GamesStore';
import { type MockGame } from '@/data/mockGames';
import {
  CURRENT_USER_ID,
  fixtureLabel,
  peopleAtGame,
  type MockPerson,
} from '@/data/mockPeople';
import { colors, spacing } from '@/theme';

const MARK_NODE_COUNT = 29;

function sortPlayedRecentFirst(games: MockGame[]): MockGame[] {
  return [...games].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.timeRange < b.timeRange ? 1 : -1;
  });
}

/** Stable archive fixture numbers — oldest PLAYED = 01. */
function fixtureNumbersForPlayed(played: MockGame[]): Map<string, string> {
  const chronological = [...played].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return a.timeRange < b.timeRange ? -1 : 1;
  });
  const map = new Map<string, string>();
  chronological.forEach((game, index) => {
    map.set(game.id, fixtureLabel(index + 1));
  });
  return map;
}

function formatA11yDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function markAccentForFixture(fixtureNumber: string): {
  index: number;
  state: 'resolved';
} {
  const n = Number(fixtureNumber) || 1;
  return {
    index: ((n - 1) * 7) % MARK_NODE_COUNT,
    state: 'resolved',
  };
}

function openPerson(
  router: ReturnType<typeof useRouter>,
  person: MockPerson,
) {
  if (person.id === CURRENT_USER_ID) {
    router.push('/profile');
    return;
  }
  router.push({ pathname: '/person/[id]', params: { id: person.id } });
}

function PersonNameLink({
  person,
  isLast,
}: {
  person: MockPerson;
  isLast: boolean;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => openPerson(router, person)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${person.name}'s club record`}
      hitSlop={6}
      style={({ pressed }) => [pressed && styles.namePressed]}
    >
      <Text variant="body">
        {person.name}
        {isLast ? '' : ' · '}
      </Text>
    </Pressable>
  );
}

function JournalEntry({
  game,
  fixtureNumber,
  games,
}: {
  game: MockGame;
  fixtureNumber: string;
  games: MockGame[];
}) {
  const router = useRouter();
  const people = peopleAtGame(game.id, games);
  const accent = markAccentForFixture(fixtureNumber);

  return (
    <View style={styles.entry}>
      <MotionPressable
        haptic="selection"
        onPress={() =>
          router.push({ pathname: '/game/[id]', params: { id: game.id } })
        }
        accessibilityRole="button"
        accessibilityLabel={`Open ${game.venue} game, ${formatA11yDate(game.date)}`}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.dateRow}>
          <Text variant="meta">{game.dateLabel}</Text>
          <Text variant="meta" muted>
            {fixtureNumber}
          </Text>
        </View>

        <Text variant="title" style={styles.venue}>
          {game.venue}
        </Text>

        <Text variant="body" muted style={styles.timeLine}>
          {game.timeRange} {game.period}
        </Text>

        <Text variant="body" muted style={styles.formatLine}>
          {game.court} · {game.formatLevel}
        </Text>
      </MotionPressable>

      <View style={styles.playedWith}>
        <Text variant="meta" muted>
          PLAYED WITH —
        </Text>
        {people.length === 0 ? (
          <Text variant="body" muted style={styles.playedNames}>
            —
          </Text>
        ) : (
          <View style={styles.playedNames}>
            {people.map((person, index) => (
              <PersonNameLink
                key={person.id}
                person={person}
                isLast={index === people.length - 1}
              />
            ))}
          </View>
        )}
      </View>

      <View pointerEvents="none" style={styles.markWrap}>
        <BroccoliMark
          tone="light"
          compact
          size={0.48}
          animated={false}
          accents={[accent]}
          activePresence="quiet"
        />
      </View>

      <View style={styles.rule} />
    </View>
  );
}

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { games, pastGames } = useGamesStore();

  const entries = useMemo(
    () => sortPlayedRecentFirst(pastGames),
    [pastGames],
  );
  const fixtureNumbers = useMemo(
    () => fixtureNumbersForPlayed(pastGames),
    [pastGames],
  );

  const empty = entries.length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 110 + insets.bottom },
        ]}
      >
        <Entrance>
          <View style={styles.header}>
            <Text variant="meta" muted>
              THE JOURNAL
            </Text>
            {empty ? (
              <Text variant="headline" style={styles.pageTitle}>
                NOTHING YET.
              </Text>
            ) : (
              <Text variant="headline" style={styles.pageTitle}>
                WHAT WE PLAYED
              </Text>
            )}
          </View>
        </Entrance>

        {empty ? (
          <View style={styles.empty}>
            <Text variant="body" muted style={styles.emptyCopy}>
              Your played games will appear here.
            </Text>
            <MotionPressable
              haptic="selection"
              onPress={() => router.push('/games')}
              accessibilityRole="button"
              accessibilityLabel="Open Games"
              style={({ pressed }) => [
                styles.emptyLink,
                pressed && styles.pressed,
              ]}
            >
              <Text variant="label">← Games</Text>
            </MotionPressable>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((game) => (
              <JournalEntry
                key={game.id}
                game={game}
                fixtureNumber={fixtureNumbers.get(game.id) ?? '—'}
                games={games}
              />
            ))}
          </View>
        )}

        {!empty ? (
          <View style={styles.footer}>
            <Text variant="meta" muted>
              Club archive · field notebook
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  content: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.lg,
  },
  header: {
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  pageTitle: {
    marginTop: spacing.sm,
  },
  list: {
    marginTop: spacing.sm,
  },
  entry: {
    paddingTop: spacing.xxl,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venue: {
    marginTop: spacing.md,
  },
  timeLine: {
    marginTop: spacing.sm,
  },
  formatLine: {
    marginTop: 2,
  },
  playedWith: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
  },
  playedNames: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexShrink: 1,
  },
  namePressed: {
    opacity: 0.6,
  },
  markWrap: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    alignItems: 'flex-start',
    height: 56,
    overflow: 'hidden',
    opacity: 0.85,
  },
  rule: {
    marginTop: spacing.lg,
    height: 1,
    backgroundColor: colors.concrete,
  },
  empty: {
    marginTop: spacing.section - 4,
    gap: spacing.xl,
  },
  emptyCopy: {
    maxWidth: 280,
  },
  emptyLink: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.section - 4,
  },
  pressed: {
    opacity: 0.68,
  },
});
