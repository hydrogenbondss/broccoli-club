import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

type Filter = 'upcoming' | 'past';

const dataCyan = '#71DEE6';
const dataAcid = '#C7F34A';
const darkRule = '#2A2D29';
const darkMuted = '#8D9188';

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function Marker({ color = colors.signal }: { color?: string }) {
  return <View style={[styles.marker, { backgroundColor: color }]} />;
}

function DotField({ count = 72 }: { count?: number }) {
  const dots = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <View pointerEvents="none" style={styles.dotField}>
      {dots.map((_, index) => (
        <View
          key={index}
          style={[
            styles.gridDot,
            index % 11 === 0 && styles.gridDotHot,
            index % 17 === 0 && styles.gridDotAccent,
          ]}
        />
      ))}
    </View>
  );
}

function MotionTrace() {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Reanimated SharedValues are intentionally mutable.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        }),
        withTiming(0, {
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        }),
      ),
      -1,
      false,
    );
  }, [progress]);

  const runnerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * 92 },
      { translateY: -Math.sin(progress.value * Math.PI) * 30 },
      { rotate: '-18deg' },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + progress.value * 0.22,
    transform: [
      { translateX: progress.value * 82 },
      { translateY: -Math.sin(progress.value * Math.PI) * 24 },
      { scale: 0.9 + progress.value * 0.18 },
    ],
  }));

  return (
    <View pointerEvents="none" style={styles.traceWrap}>
      <View style={styles.traceCrossVertical} />
      <View style={styles.traceCrossHorizontal} />
      <View style={styles.traceRouteOne} />
      <View style={styles.traceRouteTwo} />

      <Animated.View style={[styles.traceGlow, glowStyle]}>
        <View style={styles.traceGlowCore} />
      </Animated.View>

      <Animated.View style={[styles.traceRunner, runnerStyle]}>
        <View style={styles.runnerHead} />
        <View style={styles.runnerBody} />
        <View style={styles.runnerLegLeft} />
        <View style={styles.runnerLegRight} />
      </Animated.View>

      <View style={styles.traceOrigin}>
        <Marker color={dataCyan} />
        <Text variant="meta" style={styles.traceOriginText}>
          START
        </Text>
      </View>

      <View style={styles.traceTarget}>
        <Text variant="meta" style={styles.traceTargetText}>
          COURT 03
        </Text>
        <Marker color={dataAcid} />
      </View>
    </View>
  );
}

function HeroData({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.heroDataBlock}>
      <Text variant="meta" style={styles.heroDataValue}>
        {value}
      </Text>
      <Text variant="meta" style={styles.heroDataLabel}>
        {label}
      </Text>
    </View>
  );
}

function GameRow({
  index,
  date,
  time,
  place,
  detail,
  players,
  status,
  price,
  past = false,
}: {
  index: number;
  date: string;
  time: string;
  place: string;
  detail: string;
  players: string;
  status: string;
  price?: string;
  past?: boolean;
}) {
  const accent = index % 2 === 0 ? dataCyan : colors.signal;

  return (
    <MotionPressable
      haptic="selection"
      onPress={() => {}}
      style={({ pressed }) => [
        styles.gameRow,
        past && styles.gameRowPast,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.rowIndex}>
        <Text variant="meta" muted={past}>
          0{index + 1}
        </Text>
        <View style={[styles.rowAccent, { backgroundColor: accent }]} />
      </View>

      <View style={styles.rowMain}>
        <View style={styles.rowHeader}>
          <View style={styles.rowDateGroup}>
            <Text variant="meta" muted={past}>
              {date}
            </Text>
            <Text variant="display" style={styles.rowTime}>
              {time}
            </Text>
          </View>

          <View style={styles.rowSignal}>
            <Marker color={past ? colors.muted : accent} />
            <Text
              variant="meta"
              style={past ? styles.rowStatusPast : [styles.rowStatus, { color: accent }]}
            >
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.rowInfo}>
          <View style={styles.rowCopy}>
            <Text variant="title">{place}</Text>
            <Text variant="body" muted style={styles.rowDetail}>
              {detail}
            </Text>
          </View>

          <View style={styles.rowMeta}>
            <Text variant="meta" muted>
              {players}
            </Text>
            {price ? (
              <Text variant="label" style={styles.rowPrice}>
                {price}
              </Text>
            ) : (
              <Arrow />
            )}
          </View>
        </View>

        <View style={styles.rowTrace}>
          <View style={styles.rowTraceLine} />
          <View style={styles.rowTraceDots}>
            {Array.from({ length: 8 }).map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.rowTraceDot,
                  dotIndex === index + 2 && {
                    backgroundColor: accent,
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                  },
                ]}
              />
            ))}
          </View>
          <Text variant="meta" style={styles.rowTraceCode}>
            BC / FIELD
          </Text>
        </View>
      </View>
    </MotionPressable>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <MotionPressable
      haptic="selection"
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterButton,
        active && styles.filterButtonActive,
        pressed && styles.rowPressed,
      ]}
    >
      <Text
        variant="label"
        style={active ? styles.filterActiveText : styles.filterText}
      >
        {label}
      </Text>
      <View style={[styles.filterTick, active && styles.filterTickActive]} />
    </MotionPressable>
  );
}

function ClubPosterBlock() {
  return (
    <View style={styles.posterBlock}>
      <View style={styles.posterTop}>
        <Text variant="meta" style={styles.posterMeta}>
          BROCCOLI CLUB / FIELD NOTES
        </Text>
        <Text variant="meta" style={styles.posterMeta}>
          2026—09
        </Text>
      </View>

      <View style={styles.posterBody}>
        <View style={styles.posterTitleWrap}>
          <Text variant="display" style={styles.posterTitle}>
            FIND
          </Text>
          <Text variant="display" style={[styles.posterTitle, styles.posterTitleOffset]}>
            YOUR
          </Text>
          <Text variant="display" style={styles.posterTitle}>
            PEOPLE.
          </Text>
        </View>

        <View style={styles.posterGraphic}>
          <View style={styles.posterGraphicRing} />
          <View style={styles.posterGraphicCrossV} />
          <View style={styles.posterGraphicCrossH} />
          <View style={styles.posterGraphicSlash} />
          <Marker color={colors.signal} />
          <View style={styles.posterGraphicSquare} />
          <Text variant="meta" style={styles.posterGraphicLabel}>
            MOVE / MATCH / PLAY
          </Text>
        </View>
      </View>

      <View style={styles.posterBottom}>
        <Text variant="body" style={styles.posterCopy}>
          One court. A few people. Something to play.
        </Text>
        <Arrow />
      </View>
    </View>
  );
}

export default function GamesScreen() {
  const [filter, setFilter] = useState<Filter>('upcoming');

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <View style={styles.headerBrandLine}>
              <Marker color={colors.signal} />
              <Text variant="label">BROCCOLI CLUB</Text>
            </View>
            <Text variant="meta" muted style={styles.headerSub}>
              GAMES / HONG KONG
            </Text>
          </View>

          <View style={styles.headerIndex}>
            <Text variant="display" style={styles.headerNumber}>
              02
            </Text>
            <Text variant="meta" muted>
              MATCHES
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <DotField count={88} />
          <View style={styles.heroNoiseBand} />
          <View style={styles.heroTopline}>
            <View style={styles.heroTag}>
              <Marker color={dataAcid} />
              <Text variant="meta" style={styles.heroTagText}>
                NEXT GAME
              </Text>
            </View>
            <Text variant="meta" style={styles.heroCode}>
              BC—024 / ACTIVE
            </Text>
          </View>

          <MotionTrace />

          <View style={styles.heroCopy}>
            <Text variant="meta" style={styles.heroDate}>
              SUNDAY · 20 SEP · 2026
            </Text>
            <View style={styles.heroTimeRow}>
              <Text variant="display" style={styles.heroTime}>
                4—6
              </Text>
              <Text variant="title" style={styles.heroPm}>
                PM
              </Text>
            </View>
            <Text variant="headline" style={styles.heroPlace}>
              VICTORIA PARK
            </Text>
            <Text variant="body" style={styles.heroDetail}>
              Court 03 · Intermediate doubles
            </Text>
          </View>

          <View style={styles.heroDataRow}>
            <HeroData value="03" label="COURT" />
            <HeroData value="03 / 04" label="PLAYERS" />
            <HeroData value="HK$25" label="ENTRY" />
            <View style={styles.heroDataActionWrap}>
              <MotionPressable
                haptic="medium"
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.heroDataAction,
                  pressed && styles.heroActionPressed,
                ]}
              >
                <Text variant="label" style={styles.heroDataActionText}>
                  YOU’RE IN
                </Text>
                <Arrow />
              </MotionPressable>
            </View>
          </View>
        </View>

        <View style={styles.filters}>
          <FilterButton
            label="UPCOMING"
            active={filter === 'upcoming'}
            onPress={() => setFilter('upcoming')}
          />
          <FilterButton
            label="PAST"
            active={filter === 'past'}
            onPress={() => setFilter('past')}
          />
        </View>

        <View style={styles.sectionHead}>
          <View>
            <Text variant="meta" muted>
              THE FIELD
            </Text>
            <Text variant="headline" style={styles.sectionTitle}>
              {filter === 'upcoming' ? 'Open matches' : 'Played matches'}
            </Text>
          </View>
          <Text variant="meta" muted style={styles.sectionCount}>
            {filter === 'upcoming' ? '02 OPEN' : '02 LOGGED'}
          </Text>
        </View>

        <View style={styles.rows}>
          {filter === 'upcoming' ? (
            <>
              <GameRow
                index={0}
                date="SUN · 21 SEP"
                time="10—12"
                place="Kowloon Cricket Club"
                detail="Court 02 · Beginner / intermediate"
                players="02 / 04"
                status="OPEN"
                price="HK$25"
              />
              <GameRow
                index={1}
                date="SUN · 21 SEP"
                time="4—6"
                place="Happy Valley"
                detail="Court 01 · Intermediate singles"
                players="01 / 02"
                status="OPEN"
                price="HK$30"
              />
            </>
          ) : (
            <>
              <GameRow
                index={0}
                date="SAT · 13 SEP"
                time="4—6"
                place="Happy Valley"
                detail="Court 01 · Intermediate singles"
                players="02 / 02"
                status="PLAYED"
                past
              />
              <GameRow
                index={1}
                date="SUN · 07 SEP"
                time="2—4"
                place="Victoria Park"
                detail="Court 04 · Intermediate doubles"
                players="04 / 04"
                status="PLAYED"
                past
              />
            </>
          )}
        </View>

        {filter === 'upcoming' ? (
          <MotionPressable
            haptic="medium"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.findGame,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.findGameLeft}>
              <Text variant="display" style={styles.findGamePlus}>
                +
              </Text>
            </View>
            <View style={styles.findGameCopy}>
              <Text variant="meta" muted>
                HONG KONG / NOW
              </Text>
              <Text variant="headline" style={styles.findGameTitle}>
                Find another game
              </Text>
              <Text variant="body" muted>
                See what the club is playing next.
              </Text>
            </View>
            <Arrow />
          </MotionPressable>
        ) : null}

        <ClubPosterBlock />

        <View style={styles.footer}>
          <Text variant="meta" muted>
            BROCCOLI CLUB / NEVER JUST A SIDE
          </Text>
        </View>
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
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  headerBrandLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerSub: {
    marginTop: 5,
    paddingLeft: 14,
  },

  marker: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  headerIndex: {
    alignItems: 'flex-end',
  },

  headerNumber: {
    fontSize: 39,
    lineHeight: 34,
  },

  hero: {
    minHeight: 490,
    marginTop: 22,
    padding: 17,
    backgroundColor: colors.ink,
    overflow: 'hidden',
    position: 'relative',
  },

  dotField: {
    position: 'absolute',
    top: 64,
    left: 18,
    width: 205,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    opacity: 0.58,
  },

  gridDot: {
    width: 2,
    height: 2,
    backgroundColor: '#676B63',
  },

  gridDotHot: {
    width: 3,
    height: 3,
    backgroundColor: colors.signal,
  },

  gridDotAccent: {
    width: 3,
    height: 3,
    backgroundColor: dataCyan,
  },

  heroNoiseBand: {
    position: 'absolute',
    right: -42,
    top: 180,
    width: 230,
    height: 105,
    backgroundColor: '#1B1E1B',
    transform: [{ rotate: '-12deg' }],
    opacity: 0.72,
  },

  heroTopline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },

  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  heroTagText: {
    color: colors.bone,
  },

  heroCode: {
    color: darkMuted,
  },

  traceWrap: {
    position: 'absolute',
    top: 76,
    right: -8,
    width: 238,
    height: 238,
  },

  traceCrossVertical: {
    position: 'absolute',
    top: 0,
    right: 92,
    width: 1,
    height: 228,
    backgroundColor: darkRule,
  },

  traceCrossHorizontal: {
    position: 'absolute',
    left: 10,
    top: 112,
    width: 236,
    height: 1,
    backgroundColor: darkRule,
    transform: [{ rotate: '-18deg' }],
  },

  traceRouteOne: {
    position: 'absolute',
    left: 30,
    top: 68,
    width: 177,
    height: 2,
    backgroundColor: dataCyan,
    transform: [{ rotate: '-28deg' }],
    opacity: 0.88,
  },

  traceRouteTwo: {
    position: 'absolute',
    left: 88,
    top: 138,
    width: 148,
    height: 1,
    backgroundColor: colors.signal,
    transform: [{ rotate: '17deg' }],
    opacity: 0.72,
  },

  traceGlow: {
    position: 'absolute',
    left: 40,
    top: 75,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: dataCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },

  traceGlowCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bone,
  },

  traceRunner: {
    position: 'absolute',
    left: 42,
    top: 80,
    width: 30,
    height: 54,
  },

  runnerHead: {
    position: 'absolute',
    left: 9,
    top: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.bone,
  },

  runnerBody: {
    position: 'absolute',
    left: 12,
    top: 11,
    width: 4,
    height: 21,
    backgroundColor: colors.signal,
    transform: [{ rotate: '-12deg' }],
  },

  runnerLegLeft: {
    position: 'absolute',
    left: 10,
    top: 28,
    width: 4,
    height: 21,
    backgroundColor: colors.bone,
    transform: [{ rotate: '24deg' }],
  },

  runnerLegRight: {
    position: 'absolute',
    left: 14,
    top: 28,
    width: 4,
    height: 19,
    backgroundColor: colors.bone,
    transform: [{ rotate: '-38deg' }],
  },

  traceOrigin: {
    position: 'absolute',
    left: 16,
    bottom: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  traceOriginText: {
    color: darkMuted,
  },

  traceTarget: {
    position: 'absolute',
    right: 10,
    top: 27,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  traceTargetText: {
    color: darkMuted,
  },

  heroCopy: {
    marginTop: 204,
    zIndex: 3,
    width: '74%',
  },

  heroDate: {
    color: darkMuted,
    marginBottom: 3,
  },

  heroTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  heroTime: {
    fontSize: 94,
    lineHeight: 86,
    color: colors.bone,
    letterSpacing: -2.6,
  },

  heroPm: {
    color: colors.bone,
    marginLeft: 8,
    marginBottom: 12,
    letterSpacing: 0.4,
  },

  heroPlace: {
    color: colors.bone,
    marginTop: 2,
    letterSpacing: 0.1,
  },

  heroDetail: {
    color: '#C0C3BB',
    marginTop: 1,
  },

  heroDataRow: {
    minHeight: 66,
    marginTop: 19,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: darkRule,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    zIndex: 3,
  },

  heroDataBlock: {
    width: 58,
  },

  heroDataValue: {
    color: colors.bone,
  },

  heroDataLabel: {
    color: darkMuted,
    marginTop: 2,
  },

  heroDataActionWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },

  heroDataAction: {
    minHeight: 43,
    paddingHorizontal: 13,
    backgroundColor: colors.signal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  heroDataActionText: {
    color: colors.bone,
  },

  heroActionPressed: {
    opacity: 0.78,
  },

  arrow: {
    fontSize: 19,
    lineHeight: 19,
    color: colors.ink,
  },

  filters: {
    marginTop: 24,
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
  },

  filterButton: {
    minHeight: 42,
    marginRight: 24,
    paddingHorizontal: 1,
    justifyContent: 'center',
    position: 'relative',
  },

  filterButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },

  filterText: {
    color: colors.muted,
  },

  filterActiveText: {
    color: colors.ink,
  },

  filterTick: {
    position: 'absolute',
    right: -7,
    top: 9,
    width: 3,
    height: 3,
    backgroundColor: colors.concrete,
  },

  filterTickActive: {
    backgroundColor: colors.signal,
  },

  sectionHead: {
    marginTop: 28,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    marginTop: 2,
    fontSize: 31,
    lineHeight: 31,
  },

  sectionCount: {
    marginBottom: 2,
  },

  rows: {
    marginTop: 0,
  },

  gameRow: {
    minHeight: 156,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
  },

  gameRowPast: {
    opacity: 0.62,
  },

  rowPressed: {
    opacity: 0.7,
  },

  rowIndex: {
    width: 27,
    paddingTop: 2,
    alignItems: 'flex-start',
  },

  rowAccent: {
    width: 11,
    height: 2,
    marginTop: 9,
  },

  rowMain: {
    flex: 1,
    paddingLeft: 11,
  },

  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  rowDateGroup: {
    flex: 1,
  },

  rowTime: {
    fontSize: 39,
    lineHeight: 36,
    marginTop: 7,
  },

  rowSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 1,
  },

  rowStatus: {
    color: dataCyan,
  },

  rowStatusPast: {
    color: colors.muted,
  },

  rowInfo: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  rowCopy: {
    flex: 1,
    paddingRight: 10,
  },

  rowDetail: {
    marginTop: 1,
  },

  rowMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },

  rowPrice: {
    color: colors.signal,
  },

  rowTrace: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowTraceLine: {
    width: 21,
    height: 1,
    backgroundColor: colors.ink,
    opacity: 0.28,
  },

  rowTraceDots: {
    marginLeft: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rowTraceDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.concrete,
  },

  rowTraceCode: {
    marginLeft: 'auto',
    color: colors.muted,
  },

  findGame: {
    minHeight: 108,
    marginTop: 24,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  findGameLeft: {
    width: 68,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  findGamePlus: {
    fontSize: 58,
    lineHeight: 52,
    color: colors.bone,
  },

  findGameCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 13,
    paddingVertical: 13,
  },

  findGameTitle: {
    fontSize: 25,
    lineHeight: 27,
    marginTop: 3,
  },

  posterBlock: {
    marginTop: 45,
    minHeight: 300,
    padding: 16,
    backgroundColor: colors.ink,
    overflow: 'hidden',
  },

  posterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  posterMeta: {
    color: darkMuted,
  },

  posterBody: {
    minHeight: 210,
    flexDirection: 'row',
    alignItems: 'center',
  },

  posterTitleWrap: {
    flex: 1,
    paddingTop: 9,
  },

  posterTitle: {
    fontSize: 53,
    lineHeight: 48,
    color: colors.bone,
  },

  posterTitleOffset: {
    marginLeft: 18,
    color: dataAcid,
  },

  posterGraphic: {
    width: 110,
    height: 180,
    position: 'relative',
  },

  posterGraphicRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: dataCyan,
    top: 26,
    left: 0,
  },

  posterGraphicCrossV: {
    position: 'absolute',
    width: 1,
    height: 180,
    backgroundColor: '#333733',
    left: 54,
    top: 0,
  },

  posterGraphicCrossH: {
    position: 'absolute',
    width: 118,
    height: 1,
    backgroundColor: '#333733',
    left: -4,
    top: 83,
  },

  posterGraphicSlash: {
    position: 'absolute',
    width: 102,
    height: 2,
    backgroundColor: colors.signal,
    left: 4,
    top: 83,
    transform: [{ rotate: '-38deg' }],
  },

  posterGraphicSquare: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: dataAcid,
    right: 9,
    bottom: 15,
  },

  posterGraphicLabel: {
    position: 'absolute',
    right: 0,
    bottom: 15,
    color: colors.bone,
    transform: [{ rotate: '-90deg' }],
  },

  posterBottom: {
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: darkRule,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  posterCopy: {
    color: '#C8CBC4',
    maxWidth: 250,
  },

  footer: {
    alignItems: 'center',
    marginTop: 34,
  },
});
