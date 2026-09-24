import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  getPersonById,
  lastSharedGame,
  peopleAtGame,
  sharedGames,
} from '@/data/mockPeople';
import { colors, spacing, typography } from '@/theme';

function resolveId(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0];
  return undefined;
}

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function GameRow({
  game,
  index,
  onPress,
}: {
  game: MockGame;
  index: number;
  onPress: () => void;
}) {
  return (
    <MotionPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open game at ${game.venue}, ${game.dateLabel}`}
      style={({ pressed }) => [styles.gameRow, pressed && styles.pressed]}
    >
      <View style={styles.gameRowLeft}>
        <Text variant="meta" muted>
          {fixtureLabel(index + 1)}
        </Text>
        <View style={styles.gameRowCopy}>
          <Text variant="title">{game.venue}</Text>
          <Text variant="body" muted>
            {game.listDate} · {game.timeRange} {game.period}
          </Text>
        </View>
      </View>
      <Arrow />
    </MotionPressable>
  );
}

export default function PersonDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = resolveId(params.id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { games } = useGamesStore();
  const person = id ? getPersonById(id) : undefined;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  if (!person || person.id === CURRENT_USER_ID) {
    return (
      <View
        style={[
          styles.screen,
          styles.centered,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text variant="headline">PERSON NOT FOUND</Text>
        <Text variant="body" muted style={styles.notFoundCopy}>
          No club record for this id.
        </Text>
        <MotionPressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}
        >
          <Text variant="label">← Back</Text>
        </MotionPressable>
      </View>
    );
  }

  const together = sharedGames(CURRENT_USER_ID, person.id, games);
  const last = lastSharedGame(CURRENT_USER_ID, person.id, games);
  /** Relationship circle at last shared fixture — includes current user. */
  const playedWith = last
    ? peopleAtGame(last.id, games).filter((p) => p.id !== person.id)
    : [];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.section + insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <MotionPressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [styles.backHit, pressed && styles.pressed]}
          >
            <Text variant="label">← Back</Text>
          </MotionPressable>
          <Text variant="meta" muted>
            Club record
          </Text>
        </View>

        <Entrance>
          <View style={styles.identityRow}>
            <View style={styles.identityCopy}>
              <Text variant="display" style={styles.name}>
                {person.name.toUpperCase()}
              </Text>
              <Text variant="meta" muted style={styles.subLine}>
                {fixtureLabel(together.length)} GAMES TOGETHER
              </Text>
            </View>
            <View style={styles.markBlock}>
              <BroccoliMark
                tone="light"
                compact
                size={0.72}
                animated={false}
                accents={[{ index: person.markNode, state: 'active' }]}
                activePresence="quiet"
              />
            </View>
          </View>
        </Entrance>

        <Entrance delay={40}>
          <View style={styles.relation}>
            <View style={styles.relationBlock}>
              <Text variant="meta" muted>
                LAST PLAYED
              </Text>
              <Text variant="title" style={styles.relationValue}>
                {last ? `${last.venue} · ${last.dateShort}` : '—'}
              </Text>
            </View>
            <View style={[styles.relationBlock, styles.relationBlockLast]}>
              <Text variant="meta" muted>
                PLAYED WITH
              </Text>
              <Text variant="body" style={styles.playedWithLine}>
                {playedWith.length > 0
                  ? playedWith.map((p) => p.name).join(' · ')
                  : last
                    ? 'Just you'
                    : '—'}
              </Text>
            </View>
          </View>
        </Entrance>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text variant="meta" muted>
                Shared
              </Text>
              <Text variant="headline" style={styles.sectionTitle}>
                Recent games
              </Text>
            </View>
            <Text variant="meta" muted>
              {fixtureLabel(together.length)}
            </Text>
          </View>

          {together.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="body" muted>
                No shared games yet.
              </Text>
            </View>
          ) : (
            together.map((game, index) => (
              <GameRow
                key={game.id}
                game={game}
                index={index}
                onPress={() =>
                  router.push({ pathname: '/game/[id]', params: { id: game.id } })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: spacing.page,
  },
  notFoundCopy: { textAlign: 'center', maxWidth: 280 },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backHit: { minHeight: 44, justifyContent: 'center' },
  backLink: { marginTop: 8, minHeight: 40, justifyContent: 'center' },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  identityCopy: { flex: 1, paddingRight: 8 },
  name: {},
  subLine: { marginTop: 12 },
  markBlock: {
    width: 88,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 2,
  },
  relation: {
    paddingTop: 22,
  },
  relationBlock: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    marginBottom: 18,
  },
  relationBlockLast: {
    marginBottom: 0,
  },
  relationValue: {
    marginTop: 8,
  },
  playedWithLine: {
    marginTop: 8,
  },
  section: { marginTop: 36 },
  sectionHead: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: { marginTop: 2 },
  gameRow: {
    minHeight: 72,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 10,
  },
  gameRowCopy: { flex: 1 },
  arrow: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: typography.label.fontFamily,
  },
  empty: {
    minHeight: 64,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  pressed: { opacity: 0.68 },
});
