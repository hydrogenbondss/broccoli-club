import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BroccoliMark, fixtureMarkAccents } from '@/components/BroccoliMark';
import { Entrance } from '@/components/Entrance';
import { MotionPressable } from '@/components/MotionPressable';
import { StateFadeText } from '@/components/StateFadeText';
import { Text } from '@/components/Text';
import { useGamesStore } from '@/context/GamesStore';
import {
  playersLabel,
  type MockGame,
  userStateLabel,
} from '@/data/mockGames';
import { colors, spacing, typography } from '@/theme';

function Avatar({ initials, tone = 'light', size = 42 }: { initials: string; tone?: 'dark' | 'green' | 'light'; size?: number }) {
  return (
    <View style={[
      styles.avatar,
      tone === 'dark' && styles.avatarDark,
      tone === 'green' && styles.avatarGreen,
      tone === 'light' && styles.avatarLight,
      { width: size, height: size, borderRadius: size / 2 },
    ]}>
      <Text variant="label" style={tone === 'light' ? styles.avatarLightText : styles.avatarDarkText}>{initials}</Text>
    </View>
  );
}

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function GameCard({ game, onPress }: { game: MockGame; onPress: () => void }) {
  const state = userStateLabel(game);
  const isLive = state === 'YOU\'RE IN' || state === 'OPEN';

  return (
    <MotionPressable
      onPress={onPress}
      haptic="medium"
      accessibilityRole="button"
      accessibilityLabel={`Open featured game at ${game.venue}`}
      accessibilityHint={`Status ${state}. ${playersLabel(game)} players`}
      style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}
    >
      <View style={styles.gameCardTop}>
        <View style={styles.live}>
          {isLive ? <View style={styles.liveDot} /> : null}
          <StateFadeText
            value={state}
            variant="meta"
            style={isLive ? styles.signalText : styles.darkMuted}
          />
        </View>
        <Text variant="meta" style={styles.darkMuted}>01 / 03</Text>
      </View>

      <View style={styles.gameVisual}>
        <View pointerEvents="none" style={styles.markGraphic}>
          <BroccoliMark
            tone="dark"
            size={1.15}
            animated={false}
            activePresence="quiet"
            accents={fixtureMarkAccents(game)}
          />
        </View>
        <View style={styles.timeBlock}>
          <Text variant="meta" style={styles.darkMuted}>{game.dateLabel}</Text>
          <View style={styles.timeRow}>
            <Text variant="time" style={styles.time}>{game.timeRange}</Text>
            <Text variant="label" style={styles.pm}>{game.period}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.gameCopy}>
          <Text variant="headline" style={styles.lightHeading}>{game.venue}</Text>
          <Text variant="body" style={styles.darkBody}>{game.detail}</Text>
        </View>
        <View style={styles.peopleStack}>
          <Avatar initials="J" tone="light" size={34} />
          <View style={styles.stackOverlap}><Avatar initials="A" tone="green" size={34} /></View>
          <View style={styles.stackOverlap}><Avatar initials="M" tone="light" size={34} /></View>
          <View style={styles.stackOverlap}><Avatar initials="+" tone="light" size={34} /></View>
        </View>
      </View>

      <View style={styles.gameBottom}>
        <StateFadeText
          value={`${playersLabel(game)} players`}
          variant="meta"
          style={styles.darkMuted}
        />
        <Text variant="label" style={styles.boneLabel}>View game <Text style={styles.boneArrow}>↗</Text></Text>
      </View>
    </MotionPressable>
  );
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export default function PlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    featuredGame: featured,
    openGamesCount: openCount,
    playHeaderDay: headerDay,
  } = useGamesStore();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 105 + insets.bottom }]}
      >
        <View style={styles.header}>
          <View>
            <Text variant="label">Broccoli Club</Text>
            <Text variant="meta" muted style={styles.headerMeta}>Hong Kong · {headerDay}</Text>
          </View>
          <MotionPressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open People"
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Avatar initials="J" tone="green" size={38} />
          </MotionPressable>
        </View>

        <Entrance>
          <View style={styles.intro}>
            <Text variant="meta" muted>Your club, today</Text>
            <Text variant="display" style={styles.introTitle}>Play{'\n'}something.</Text>
          </View>
        </Entrance>

        <Entrance delay={40}>
          <GameCard
            game={featured}
            onPress={() => router.push({ pathname: '/game/[id]', params: { id: featured.id } })}
          />
        </Entrance>

        <Entrance delay={80}>
          <View style={styles.pulse}>
            <View style={styles.pulseItem}>
              <Text variant="title" style={styles.pulseNumber}>03</Text>
              <Text variant="meta" muted>Players looking</Text>
            </View>
            <View style={styles.pulseRule} />
            <View style={styles.pulseItem}>
              <Text variant="title" style={styles.pulseNumber}>{pad2(openCount)}</Text>
              <Text variant="meta" muted>Games open</Text>
            </View>
            <View style={styles.pulseRule} />
            <View style={styles.pulseItem}>
              <Text variant="title" style={styles.pulseNumber}>01</Text>
              <Text variant="meta" muted>Weekend</Text>
            </View>
          </View>
        </Entrance>

        <MotionPressable
          onPress={() => router.push('/game/new')}
          accessibilityRole="button"
          accessibilityLabel="Create a game"
          accessibilityHint="Opens the create game form"
          style={({ pressed }) => [styles.needPlayers, pressed && styles.pressed]}
        >
          <View>
            <Text variant="meta" muted>Have a court?</Text>
            <Text variant="title" style={styles.needTitle}>Bring the club in.</Text>
            <Text variant="body" muted style={styles.needCopy}>Open a game and fill the empty spots.</Text>
          </View>
          <Arrow />
        </MotionPressable>

        <View style={styles.footer}>
          <Text variant="body" muted>Never just a side.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg, paddingBottom: 105 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerMeta: { marginTop: 4 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarDark: { backgroundColor: colors.ink },
  avatarGreen: { backgroundColor: colors.broccoli },
  avatarLight: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.concrete },
  avatarDarkText: { color: colors.bone },
  avatarLightText: { color: colors.ink },
  intro: { marginTop: 38, marginBottom: 22 },
  introTitle: {
    marginTop: 7,
  },
  gameCard: { backgroundColor: colors.ink, padding: 16, minHeight: 400, overflow: 'hidden' },
  gameCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.signal },
  signalText: { color: colors.signal },
  boneLabel: { color: colors.bone },
  boneArrow: { color: colors.bone, fontSize: 14, fontFamily: typography.label.fontFamily },
  darkMuted: { color: colors.muted },
  gameVisual: { height: 176, marginTop: 2, position: 'relative', overflow: 'hidden' },
  markGraphic: {
    position: 'absolute',
    right: -54,
    top: -48,
    opacity: 0.72,
    transform: [{ rotate: '-9deg' }],
  },
  timeBlock: { position: 'absolute', left: 0, bottom: 0, zIndex: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end' },
  /** TIME role + controlled size modifier for featured poster */
  time: {
    color: colors.bone,
    fontSize: 80,
    lineHeight: 76,
    letterSpacing: -2.4,
  },
  pm: { color: colors.bone, marginLeft: 4, marginBottom: 10 },
  gameInfo: { paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.muted, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  gameCopy: { flex: 1, paddingRight: 10 },
  lightHeading: { color: colors.bone },
  darkBody: { color: colors.concrete, marginTop: 2 },
  peopleStack: { width: 95, height: 34, flexDirection: 'row', justifyContent: 'flex-end' },
  stackOverlap: { marginLeft: -8 },
  gameBottom: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.muted, flexDirection: 'row', justifyContent: 'space-between' },
  arrow: { color: colors.ink, fontSize: 18, lineHeight: 20, fontFamily: typography.label.fontFamily },
  pulse: { marginTop: 0, minHeight: 64, backgroundColor: colors.bone, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  pulseItem: { alignItems: 'center', flex: 1 },
  pulseNumber: { fontSize: typography.title.fontSize, lineHeight: typography.title.lineHeight, letterSpacing: typography.title.letterSpacing, fontFamily: typography.title.fontFamily },
  pulseRule: { width: 1, height: 28, backgroundColor: colors.concrete },
  needPlayers: { marginTop: 32, minHeight: 88, paddingVertical: 16, paddingHorizontal: 0, backgroundColor: colors.bone, borderTopWidth: 1, borderTopColor: colors.concrete, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  needTitle: { marginTop: 3 },
  needCopy: { marginTop: 3 },
  footer: { alignItems: 'center', marginTop: 32 },
  pressed: { opacity: 0.68 },
});
