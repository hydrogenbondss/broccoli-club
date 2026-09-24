import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BroccoliMark } from '@/components/BroccoliMark';
import { Entrance } from '@/components/Entrance';
import { MotionPressable } from '@/components/MotionPressable';
import { StateFadeText } from '@/components/StateFadeText';
import { Text } from '@/components/Text';
import { useGamesStore } from '@/context/GamesStore';
import {
  playersLabel,
  priceLabel,
  type MockGame,
  userStateLabel,
} from '@/data/mockGames';
import { colors, spacing, typography } from '@/theme';

function Marker({ active = false }: { active?: boolean }) {
  return <View style={[styles.marker, active && styles.markerActive]} />;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Tiny cropped constellation — sparse interruption only, no accents. */
function ConstellationFragment({ style }: { style?: object }) {
  return (
    <View pointerEvents="none" style={[styles.fragment, style]}>
      <BroccoliMark
        tone="light"
        compact
        size={0.85}
        animated={false}
        accents={[]}
      />
    </View>
  );
}

/** Quiet next-fixture bar — editorial index entry, not a Play poster. */
function NextFixture({ game, onPress }: { game: MockGame; onPress: () => void }) {
  const state = userStateLabel(game);
  const isSignal = state === "YOU'RE IN" || state === 'OPEN';

  return (
    <MotionPressable
      haptic="medium"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open next fixture at ${game.venue}, ${state}`}
      accessibilityHint={`${playersLabel(game)} players`}
      style={({ pressed }) => [styles.nextFixture, pressed && styles.pressed]}
    >
      <ConstellationFragment style={styles.nextFragment} />

      <View style={styles.nextHead}>
        <Text variant="meta" muted>Next · {game.dateLabel}</Text>
        <View style={styles.liveLine}>
          <Marker active={isSignal} />
          <StateFadeText
            value={state}
            variant="meta"
            style={isSignal ? styles.signalText : styles.mutedText}
          />
        </View>
      </View>

      <View style={styles.nextMain}>
        <View style={styles.nextTimeBlock}>
          <Text variant="time" style={styles.nextTime}>{game.timeRange}</Text>
          <Text variant="label" style={styles.nextPm}>{game.period}</Text>
        </View>
        <View style={styles.nextCopy}>
          <Text variant="headline" style={styles.nextPlace}>{game.venue}</Text>
          <Text variant="body" muted style={styles.nextDetail}>{game.detail}</Text>
        </View>
        <Text style={styles.nextArrow}>↗</Text>
      </View>

      <View style={styles.nextFooter}>
        <View style={styles.nextStat}>
          <Text variant="meta" muted>Players</Text>
          <StateFadeText value={playersLabel(game)} variant="label" />
        </View>
        <View style={styles.nextStat}>
          <Text variant="meta" muted>Entry</Text>
          <Text variant="label">{priceLabel(game)}</Text>
        </View>
        <View style={styles.inButton}>
          <StateFadeText value={state} variant="label" style={styles.inButtonText} />
        </View>
      </View>
    </MotionPressable>
  );
}

function GameRow({ index, game, onPress }: {
  index: number; game: MockGame; onPress: () => void;
}) {
  const status = userStateLabel(game);
  const isSignal = status === "YOU'RE IN" || status === 'OPEN';

  return (
    <MotionPressable
      haptic="selection"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.venue} game, ${status}`}
      accessibilityHint={`${playersLabel(game)} players`}
      style={({ pressed }) => [styles.gameRow, pressed && styles.pressed]}
    >
      <View style={styles.rowNumber}>
        <Text variant="meta" muted>{pad2(index + 1)}</Text>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text variant="meta" muted>{game.listDate}</Text>
          <View style={styles.status}>
            <Marker active={isSignal} />
            <StateFadeText
              value={status}
              variant="meta"
              style={isSignal ? styles.openText : styles.mutedText}
            />
          </View>
        </View>
        <View style={styles.rowMain}>
          <View style={styles.rowCopy}>
            <Text variant="title">{game.venue}</Text>
            <Text variant="body" muted style={styles.detail}>{game.detail}</Text>
          </View>
          <View style={styles.rowRight}>
            <StateFadeText value={playersLabel(game)} variant="meta" muted />
            <Text variant="label" style={styles.price}>{priceLabel(game)}</Text>
          </View>
        </View>
      </View>
    </MotionPressable>
  );
}

export default function GamesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    featuredGame: featured,
    upcomingGames: upcoming,
  } = useGamesStore();
  const openCount = upcoming.length;
  const liveCount = openCount + (featured.status === 'OPEN' ? 1 : 0);
  const empty = upcoming.length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
      >
        <View style={styles.header}>
          <View>
            <Text variant="label">Broccoli Club</Text>
            <Text variant="meta" muted style={styles.headerSub}>Games / Hong Kong</Text>
          </View>
          <Text variant="meta" muted>{pad2(openCount)}</Text>
        </View>

        <Entrance>
          <View style={styles.titleRow}>
            <Text variant="display" style={styles.pageTitle}>Games</Text>
            <View style={styles.titleMeta}>
              <Text variant="meta" muted>{pad2(liveCount)} upcoming</Text>
            </View>
          </View>
        </Entrance>

        <View style={styles.editorialHead}>
          <Text variant="meta" muted>Field index</Text>
          <Text variant="meta" muted>{pad2(openCount)} upcoming</Text>
        </View>

        <Entrance delay={40}>
          <NextFixture
            game={featured}
            onPress={() => router.push({ pathname: '/game/[id]', params: { id: featured.id } })}
          />
        </Entrance>

        <View style={styles.sectionHead}>
          <View>
            <Text variant="meta" muted>The field</Text>
            <Text variant="headline" style={styles.sectionTitle}>Open games</Text>
          </View>
          <Text variant="meta" muted>{pad2(openCount)} open</Text>
        </View>

        {empty ? (
          <View style={styles.emptyList}>
            <Text variant="meta" muted>NOTHING OPEN</Text>
            <Text variant="body" muted style={styles.emptyCopy}>
              No upcoming games on the field.
            </Text>
            <View style={styles.emptyRoutes}>
              <MotionPressable
                haptic="selection"
                onPress={() => router.push('/')}
                accessibilityRole="button"
                accessibilityLabel="Open Play"
                style={({ pressed }) => [styles.emptyLink, pressed && styles.pressed]}
              >
                <Text variant="label">← Play</Text>
              </MotionPressable>
              <MotionPressable
                haptic="selection"
                onPress={() => router.push('/game/new')}
                accessibilityRole="button"
                accessibilityLabel="Create a game"
                style={({ pressed }) => [styles.emptyLink, pressed && styles.pressed]}
              >
                <Text variant="label">Create ↗</Text>
              </MotionPressable>
            </View>
          </View>
        ) : (
          upcoming.map((game, index) => (
            <GameRow
              key={game.id}
              index={index}
              game={game}
              onPress={() => router.push({ pathname: '/game/[id]', params: { id: game.id } })}
            />
          ))
        )}

        <View style={styles.footer}>
          <Text variant="meta" muted>Broccoli Club / Never just a side</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerSub: { marginTop: 5 },
  titleRow: { marginTop: 22, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  pageTitle: {},
  titleMeta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 5 },
  editorialHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  fragment: { position: 'absolute' },
  nextFixture: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  nextFragment: {
    right: -28,
    top: -22,
    opacity: 0.14,
    transform: [{ rotate: '8deg' }],
  },
  nextHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  liveLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  signalText: { color: colors.signal },
  marker: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  markerActive: { backgroundColor: colors.signal },
  nextMain: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  nextTimeBlock: {
    marginRight: 12,
  },
  /** TIME role + controlled size modifier for index entry */
  nextTime: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.2,
  },
  nextPm: { color: colors.ink, marginTop: 2 },
  nextCopy: { flex: 1, paddingRight: 10 },
  nextPlace: { color: colors.ink },
  nextDetail: { marginTop: 2 },
  nextArrow: {
    fontSize: 18,
    lineHeight: 20,
    color: colors.ink,
    marginBottom: 2,
    fontFamily: typography.label.fontFamily,
  },
  nextFooter: {
    minHeight: 48,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    zIndex: 2,
  },
  nextStat: { gap: 2 },
  inButton: {
    marginLeft: 'auto',
    minHeight: 44,
    paddingHorizontal: 12,
    backgroundColor: colors.bone,
    borderWidth: 1,
    borderColor: colors.ink,
    justifyContent: 'center',
  },
  inButtonText: { color: colors.ink },
  sectionHead: { marginTop: 28, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { marginTop: 3 },
  gameRow: { minHeight: 118, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row' },
  rowNumber: { width: 29, paddingTop: 2 },
  rowBody: { flex: 1, paddingLeft: 10 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  openText: { color: colors.signal },
  mutedText: { color: colors.muted },
  rowMain: { marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  rowCopy: { flex: 1, paddingRight: 12 },
  detail: { marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 5 },
  price: { color: colors.ink },
  footer: { alignItems: 'center', marginTop: 34 },
  emptyList: {
    minHeight: 120,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    gap: 10,
  },
  emptyCopy: { maxWidth: 280 },
  emptyRoutes: { flexDirection: 'row', gap: 24, marginTop: 8 },
  emptyLink: { minHeight: 40, justifyContent: 'center' },
  pressed: { opacity: 0.68 },
});
