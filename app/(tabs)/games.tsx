import { useEffect, useState } from 'react';
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

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function StatusMark({ active = true }: { active?: boolean }) {
  return (
    <View
      style={[styles.statusMark, active ? styles.statusMarkActive : styles.statusMarkPast]}
    />
  );
}

function CourtGraphic() {
  const ball = useSharedValue(0);

  useEffect(() => {
    // Reanimated SharedValues are intentionally mutable.
    // eslint-disable-next-line react-hooks/immutability
    ball.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        }),
        withTiming(0, {
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        }),
      ),
      -1,
      false,
    );
  }, [ball]);

  const animatedBall = useAnimatedStyle(() => ({
    transform: [
      { translateX: ball.value * 38 },
      { translateY: Math.sin(ball.value * Math.PI) * -14 },
    ],
  }));

  return (
    <View pointerEvents="none" style={styles.graphic}>
      <View style={styles.graphicCircle} />
      <View style={styles.graphicCross} />
      <View style={styles.graphicLine} />
      <View style={styles.graphicPlayers}>
        <View style={[styles.playerDot, styles.playerDotA]} />
        <View style={[styles.playerDot, styles.playerDotB]} />
        <View style={[styles.playerDot, styles.playerDotC]} />
      </View>
      <Animated.View style={[styles.ball, animatedBall]} />
      <Text style={styles.graphicLabel}>BC / 03</Text>
    </View>
  );
}

function GameRow({
  date,
  time,
  place,
  details,
  players,
  status,
  price,
  past = false,
}: {
  date: string;
  time: string;
  place: string;
  details: string;
  players: string;
  status: string;
  price?: string;
  past?: boolean;
}) {
  return (
    <MotionPressable
      haptic="selection"
      onPress={() => {}}
      style={({ pressed }) => [
        styles.gameRow,
        past && styles.gameRowPast,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowDate}>
        <Text variant="meta" muted={past}>
          {date}
        </Text>
        <Text variant="display" style={styles.rowTime}>
          {time}
        </Text>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTopline}>
          <Text variant="title" style={styles.rowPlace}>
            {place}
          </Text>
          <View style={styles.rowStatus}>
            <StatusMark active={!past} />
            <Text
              variant="meta"
              style={past ? styles.rowStatusPast : styles.rowStatusActive}
            >
              {status}
            </Text>
          </View>
        </View>

        <Text variant="body" muted style={styles.rowDetails}>
          {details}
        </Text>

        <View style={styles.rowFooter}>
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
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant="label"
        style={active ? styles.filterActiveText : styles.filterText}
      >
        {label}
      </Text>
    </MotionPressable>
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
            <Text variant="label">BROCCOLI CLUB</Text>
            <Text variant="meta" muted style={styles.headerMeta}>
              GAME LOG
            </Text>
          </View>

          <View style={styles.headerStamp}>
            <Text variant="meta">02</Text>
            <Text variant="meta" muted>
              NEXT
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroLabel}>
              <StatusMark />
              <Text variant="meta" style={styles.heroLabelText}>
                NEXT GAME
              </Text>
            </View>

            <Text variant="meta" style={styles.heroCode}>
              BC / GAME 024
            </Text>
          </View>

          <CourtGraphic />

          <View style={styles.heroDate}>
            <Text variant="label" style={styles.heroDateText}>
              SUNDAY · 20 SEP
            </Text>
            <Text variant="display" style={styles.heroTime}>
              4—6
            </Text>
            <Text variant="body" style={styles.heroPm}>
              pm
            </Text>
          </View>

          <View style={styles.heroRule} />

          <View style={styles.heroInfo}>
            <View style={styles.heroCopy}>
              <Text variant="title" style={styles.heroVenue}>
                Victoria Park
              </Text>
              <Text variant="body" style={styles.heroDetails}>
                Court 03 · Intermediate doubles
              </Text>
            </View>

            <View style={styles.heroSide}>
              <Text variant="meta" style={styles.heroSideLabel}>
                3 / 4
              </Text>
              <Text variant="meta" style={styles.heroSideMuted}>
                PLAYERS
              </Text>
            </View>
          </View>

          <MotionPressable
            haptic="medium"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.heroAction,
              pressed && styles.heroActionPressed,
            ]}
          >
            <Text variant="label" style={styles.heroActionText}>
              YOU’RE IN
            </Text>
            <Arrow />
          </MotionPressable>
        </View>

        <View style={styles.filterBar}>
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
          <Text variant="headline" style={styles.sectionTitle}>
            {filter === 'upcoming' ? 'Coming up' : 'Played'}
          </Text>
          <Text variant="meta" muted>
            {filter === 'upcoming' ? 'IN THE CLUB' : 'RECENTLY'}
          </Text>
        </View>

        <View style={styles.rows}>
          {filter === 'upcoming' ? (
            <>
              <GameRow
                date="SUN · 21 SEP"
                time="10—12"
                place="Kowloon Cricket Club"
                details="Court 02 · Beginner / intermediate"
                players="2 / 4 PLAYERS"
                status="OPEN"
                price="HK$25"
              />

              <GameRow
                date="SUN · 21 SEP"
                time="4—6"
                place="Happy Valley"
                details="Court 01 · Intermediate singles"
                players="1 / 2 PLAYERS"
                status="OPEN"
                price="HK$30"
              />
            </>
          ) : (
            <>
              <GameRow
                date="SAT · 13 SEP"
                time="4—6"
                place="Happy Valley"
                details="Court 01 · Intermediate singles"
                players="2 PLAYERS"
                status="PLAYED"
                past
              />

              <GameRow
                date="SUN · 7 SEP"
                time="2—4"
                place="Victoria Park"
                details="Court 04 · Intermediate doubles"
                players="4 PLAYERS"
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
            style={({ pressed }) => [styles.findGame, pressed && styles.pressed]}
          >
            <View style={styles.findGameMark}>
              <Text variant="label" style={styles.findGameMarkText}>
                +
              </Text>
            </View>
            <View style={styles.findGameCopy}>
              <Text variant="title">Find your next game</Text>
              <Text variant="body" muted style={styles.findGameSubcopy}>
                See what’s happening around Hong Kong.
              </Text>
            </View>
            <Arrow />
          </MotionPressable>
        ) : null}

        <View style={styles.clubNote}>
          <View style={styles.clubNoteLine} />
          <View style={styles.clubNoteCopy}>
            <Text variant="meta" muted>
              THE CLUB KEEPS SCORE
            </Text>
            <Text variant="body">
              Every game becomes part of your player history.
            </Text>
          </View>
          <Text variant="display" style={styles.clubNoteNumber}>
            04
          </Text>
        </View>

        <View style={styles.footer}>
          <Text variant="body" muted>
            Never just a side.
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

  headerMeta: {
    marginTop: 2,
  },

  headerStamp: {
    alignItems: 'flex-end',
    paddingTop: 1,
  },

  hero: {
    minHeight: 420,
    marginTop: 25,
    padding: 18,
    backgroundColor: colors.ink,
    overflow: 'hidden',
    position: 'relative',
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 4,
  },

  heroLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  heroLabelText: {
    color: colors.bone,
  },

  heroCode: {
    color: colors.concrete,
  },

  heroDate: {
    marginTop: 94,
    zIndex: 4,
  },

  heroDateText: {
    color: colors.concrete,
    letterSpacing: 0.9,
  },

  heroTime: {
    marginTop: 4,
    fontSize: 82,
    lineHeight: 76,
    color: colors.bone,
  },

  heroPm: {
    color: colors.concrete,
    marginTop: -1,
  },

  heroRule: {
    height: 1,
    backgroundColor: '#3D3E39',
    marginTop: 22,
  },

  heroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
    zIndex: 4,
  },

  heroCopy: {
    flex: 1,
    paddingRight: 20,
  },

  heroVenue: {
    color: colors.bone,
  },

  heroDetails: {
    color: colors.concrete,
    marginTop: 3,
  },

  heroSide: {
    alignItems: 'flex-end',
  },

  heroSideLabel: {
    color: colors.bone,
    fontSize: 18,
    lineHeight: 20,
  },

  heroSideMuted: {
    color: colors.concrete,
    marginTop: 1,
  },

  heroAction: {
    minHeight: 49,
    marginTop: 18,
    paddingHorizontal: 16,
    backgroundColor: colors.broccoli,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 4,
  },

  heroActionPressed: {
    opacity: 0.78,
  },

  heroActionText: {
    color: colors.bone,
  },

  graphic: {
    width: 180,
    height: 180,
    position: 'absolute',
    right: -10,
    top: 49,
    opacity: 0.95,
  },

  graphicCircle: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 1,
    borderColor: '#4B4D47',
    right: 0,
    top: 4,
  },

  graphicCross: {
    position: 'absolute',
    width: 1,
    height: 164,
    backgroundColor: '#3D3E39',
    right: 78,
    top: 0,
  },

  graphicLine: {
    position: 'absolute',
    width: 205,
    height: 1,
    backgroundColor: '#3D3E39',
    right: -14,
    top: 82,
    transform: [{ rotate: '-28deg' }],
  },

  graphicPlayers: {
    position: 'absolute',
    width: 160,
    height: 160,
    top: 4,
    right: 0,
  },

  playerDot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  playerDotA: {
    top: 37,
    left: 34,
    backgroundColor: colors.signal,
  },

  playerDotB: {
    top: 102,
    left: 76,
    backgroundColor: colors.broccoli,
  },

  playerDotC: {
    top: 66,
    right: 21,
    backgroundColor: colors.bone,
  },

  ball: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.bone,
    left: 29,
    top: 116,
  },

  graphicLabel: {
    position: 'absolute',
    right: 6,
    bottom: 2,
    color: '#555850',
    fontFamily: 'IBMPlexMono-Regular',
    fontSize: 9,
    letterSpacing: 1,
  },

  filterBar: {
    marginTop: 27,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
  },

  filterButton: {
    minHeight: 40,
    marginRight: 24,
    paddingHorizontal: 1,
    justifyContent: 'center',
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

  sectionHead: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },

  sectionTitle: {
    fontSize: 29,
    lineHeight: 31,
  },

  rows: {
    marginTop: 1,
  },

  gameRow: {
    minHeight: 118,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
  },

  gameRowPast: {
    opacity: 0.72,
  },

  rowDate: {
    width: 88,
    paddingRight: 9,
  },

  rowTime: {
    fontSize: 33,
    lineHeight: 31,
    marginTop: 8,
  },

  rowBody: {
    flex: 1,
    paddingLeft: 11,
    borderLeftWidth: 1,
    borderLeftColor: colors.concrete,
    justifyContent: 'space-between',
  },

  rowTopline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  rowPlace: {
    flex: 1,
    paddingRight: 10,
  },

  rowStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 2,
  },

  statusMark: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusMarkActive: {
    backgroundColor: colors.broccoli,
  },

  statusMarkPast: {
    backgroundColor: colors.muted,
  },

  rowStatusActive: {
    color: colors.broccoli,
  },

  rowStatusPast: {
    color: colors.muted,
  },

  rowDetails: {
    marginTop: 5,
  },

  rowFooter: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowPrice: {
    color: colors.broccoli,
  },

  arrow: {
    fontSize: 20,
    lineHeight: 20,
    color: colors.ink,
  },

  findGame: {
    minHeight: 88,
    marginTop: 24,
    paddingVertical: 13,
    paddingRight: 4,
    borderTopWidth: 2,
    borderBottomWidth: 1,
    borderTopColor: colors.ink,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
  },

  findGameMark: {
    width: 39,
    height: 39,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  findGameMarkText: {
    color: colors.bone,
    fontSize: 18,
    lineHeight: 18,
  },

  findGameCopy: {
    flex: 1,
  },

  findGameSubcopy: {
    marginTop: 2,
  },

  clubNote: {
    marginTop: 43,
    paddingTop: 13,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  clubNoteLine: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: colors.broccoli,
    marginTop: 1,
    marginRight: 10,
  },

  clubNoteCopy: {
    flex: 1,
    paddingRight: 12,
  },

  clubNoteNumber: {
    fontSize: 42,
    lineHeight: 39,
  },

  footer: {
    alignItems: 'center',
    marginTop: 40,
  },

  pressed: {
    opacity: 0.66,
  },
});
