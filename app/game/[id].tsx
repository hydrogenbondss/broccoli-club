import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BroccoliMark, fixtureMarkAccents } from '@/components/BroccoliMark';
import { Entrance } from '@/components/Entrance';
import { MotionPressable } from '@/components/MotionPressable';
import { StateFadeText } from '@/components/StateFadeText';
import { Text } from '@/components/Text';
import { useGamesStore } from '@/context/GamesStore';
import {
  playersLabel,
  userStateLabel,
  priceLabel,
} from '@/data/mockGames';
import { CURRENT_USER_ID, peopleAtGame } from '@/data/mockPeople';
import { colors, spacing, typography } from '@/theme';

function resolveId(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0];
  return undefined;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Visual court figure only — strip "Court " prefix when present. */
function courtFigure(court: string): string {
  const stripped = court.replace(/^Court\s+/i, '').trim();
  return stripped.length > 0 ? stripped : court;
}

function SheetRow({
  label,
  value,
  last = false,
  strong = false,
  fade = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  strong?: boolean;
  /** Crossfade when value changes (player count, etc.). */
  fade?: boolean;
}) {
  const valueStyle = [styles.sheetValue, strong && styles.sheetValueStrong];
  return (
    <View style={[styles.sheetRow, last && styles.sheetRowLast]}>
      <Text variant="meta" muted style={styles.sheetLabel}>
        {label}
      </Text>
      {fade ? (
        <StateFadeText
          value={value}
          variant={strong ? 'title' : 'label'}
          style={valueStyle}
        />
      ) : (
        <Text
          variant={strong ? 'title' : 'label'}
          style={valueStyle}
        >
          {value}
        </Text>
      )}
    </View>
  );
}

export default function GameDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = resolveId(params.id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { games, getById, joinGame, leaveGame } = useGamesStore();
  const game = id ? getById(id) : undefined;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  if (!game) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text variant="headline">GAME NOT FOUND</Text>
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

  const state = userStateLabel(game);
  const isIn = game.joined || game.currentUserState === 'in';
  const isPlayed = game.status === 'PLAYED';
  const atCapacity = game.playersCurrent >= game.playersMax;
  const isFull = game.status === 'FULL' || (!isIn && atCapacity && !isPlayed);
  const canJoin = game.status === 'OPEN' && !isIn && !atCapacity && !isPlayed;
  const canLeave = isIn && !isPlayed;
  const isSignal = isIn || (game.status === 'OPEN' && !isFull);

  const fixtureNumber = (() => {
    const idx = games.findIndex((g) => g.id === game.id);
    return idx >= 0 ? pad2(idx + 1) : '—';
  })();

  /** Playing with = others on the court (not the current user). */
  const people = peopleAtGame(game.id, games).filter((p) => p.id !== CURRENT_USER_ID);
  const peopleLine =
    people.length === 0
      ? '—'
      : people.map((p) => p.name).join(' / ');

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
          <Text variant="meta" muted>Fixture</Text>
        </View>

        <Entrance>
          {/* HERO — fixture/date, time, venue, current state */}
          <View style={styles.dateRow}>
            <Text variant="meta">{game.dateLabel}</Text>
            <Text variant="meta" muted>{fixtureNumber}</Text>
          </View>

          <View style={styles.timeBlock}>
            <View style={styles.timeRow}>
              <Text variant="time" style={styles.time}>{game.timeRange}</Text>
              <Text variant="label" style={styles.period}>{game.period}</Text>
            </View>
          </View>

          <Text variant="headline" style={styles.venue}>{game.venue}</Text>

          <View
            style={styles.stateBlock}
            accessibilityRole="text"
            accessibilityLabel={`Player state ${state}`}
          >
            <View style={styles.live}>
              {isSignal ? <View style={styles.liveDot} /> : null}
              <StateFadeText
                value={state}
                variant="meta"
                style={isSignal ? styles.signalText : undefined}
              />
            </View>
          </View>
        </Entrance>

        {/* SHEET — editorial fixture rows; no hero repeats */}
        <View style={styles.sheetWrap}>
          <View pointerEvents="none" style={styles.sheetMark}>
            <BroccoliMark
              tone="light"
              compact
              size={0.85}
              animated={false}
              accents={fixtureMarkAccents(game)}
              activePresence="quiet"
            />
          </View>

          <View style={styles.sheet}>
            <SheetRow label="COURT" value={courtFigure(game.court)} strong />
            <SheetRow label="FORMAT" value={game.formatLevel} />
            <SheetRow label="PLAYERS" value={playersLabel(game)} strong fade />
            <SheetRow label="ENTRY" value={priceLabel(game)} strong />
            <SheetRow label="PLAYING WITH" value={peopleLine} last />
          </View>
        </View>

        {/* PRIMARY ACTION — join/leave state language (store-driven) */}
        {canJoin || canLeave ? (
          <View style={styles.ctaBlock}>
            <MotionPressable
              haptic={canJoin ? 'medium' : 'none'}
              disabled={!canJoin}
              onPress={() => joinGame(game.id)}
              accessibilityRole={canJoin ? 'button' : 'text'}
              accessibilityLabel={
                canJoin
                  ? `Join game at ${game.venue}`
                  : "YOU'RE IN"
              }
              accessibilityHint={
                canJoin ? `${playersLabel(game)} players` : undefined
              }
              accessibilityState={{ disabled: !canJoin }}
              style={({ pressed }) => [
                styles.cta,
                isIn ? styles.ctaIn : styles.ctaOut,
                canJoin && pressed && styles.pressed,
              ]}
            >
              <StateFadeText
                value={isIn ? "YOU'RE IN" : 'JOIN GAME'}
                variant="label"
                style={isIn ? styles.ctaInText : styles.ctaOutText}
              />
            </MotionPressable>
            {canLeave ? (
              <MotionPressable
                onPress={() => leaveGame(game.id)}
                accessibilityRole="button"
                accessibilityLabel={`Leave game at ${game.venue}`}
                style={({ pressed }) => [styles.cta, styles.ctaLeave, pressed && styles.pressed]}
              >
                <Text variant="label" style={styles.ctaLeaveText}>LEAVE GAME</Text>
              </MotionPressable>
            ) : null}
          </View>
        ) : null}

        {isPlayed ? (
          <View style={styles.ctaBlock}>
            <View
              style={[styles.cta, styles.ctaIn]}
              accessibilityRole="text"
              accessibilityLabel="PLAYED"
            >
              <Text variant="label" style={styles.ctaInText}>PLAYED</Text>
            </View>
          </View>
        ) : null}

        {isFull && !isIn && !isPlayed ? (
          <View style={styles.ctaBlock}>
            <View
              style={[styles.cta, styles.ctaIn]}
              accessibilityRole="text"
              accessibilityLabel="FULL"
            >
              <Text variant="label" style={styles.ctaInText}>FULL</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: spacing.page },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backHit: { minHeight: 44, justifyContent: 'center' },
  backLink: { marginTop: 8, minHeight: 40, justifyContent: 'center' },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeBlock: { marginBottom: 18 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end' },
  time: {
    color: colors.ink,
  },
  period: { marginLeft: 6, marginBottom: 8 },
  venue: { marginBottom: 14 },
  stateBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  live: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.signal },
  signalText: { color: colors.signal },
  sheetWrap: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10,
  },
  sheetMark: {
    position: 'absolute',
    right: -40,
    top: -32,
    opacity: 0.1,
    zIndex: 0,
    transform: [{ rotate: '6deg' }],
  },
  sheet: {
    zIndex: 1,
    paddingTop: 4,
  },
  sheetRow: {
    minHeight: 56,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
  },
  sheetRowLast: {},
  sheetLabel: {
    letterSpacing: 0.6,
    minWidth: 96,
  },
  sheetValue: {
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '68%',
  },
  sheetValueStrong: {
    fontFamily: typography.title.fontFamily,
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    letterSpacing: typography.title.letterSpacing,
  },
  ctaBlock: { marginTop: 32, gap: 10 },
  cta: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ctaIn: {
    backgroundColor: colors.bone,
    borderColor: colors.ink,
  },
  ctaOut: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  ctaLeave: {
    backgroundColor: colors.white,
    borderColor: colors.ink,
  },
  ctaInText: { color: colors.ink },
  ctaOutText: { color: colors.bone },
  ctaLeaveText: { color: colors.ink },
  pressed: { opacity: 0.68 },
});
