import { ScrollView, StyleSheet, View } from 'react-native';

import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

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

function CourtMark() {
  return (
    <View pointerEvents="none" style={styles.courtMark}>
      <View style={styles.courtFrame} />
      <View style={styles.courtNet} />
      <View style={styles.courtCentre} />
      <View style={styles.courtDot} />
      <View style={styles.courtSlash} />
    </View>
  );
}

function GameCard() {
  return (
    <MotionPressable onPress={() => {}} haptic="medium" style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}>
      <View style={styles.gameCardTop}>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text variant="meta" style={styles.greenText}>YOU’RE IN</Text>
        </View>
        <Text variant="meta" style={styles.darkMuted}>01 / 03</Text>
      </View>

      <View style={styles.gameVisual}>
        <CourtMark />
        <View style={styles.timeBlock}>
          <Text variant="meta" style={styles.darkMuted}>TODAY · SUN 20 SEP</Text>
          <Text style={styles.time}>4—6</Text>
          <Text variant="label" style={styles.pm}>PM</Text>
        </View>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.gameCopy}>
          <Text variant="headline" style={styles.lightHeading}>VICTORIA PARK</Text>
          <Text variant="body" style={styles.darkBody}>Court 03 · Intermediate doubles</Text>
        </View>
        <View style={styles.peopleStack}>
          <Avatar initials="J" tone="light" size={34} />
          <View style={styles.stackOverlap}><Avatar initials="A" tone="green" size={34} /></View>
          <View style={styles.stackOverlap}><Avatar initials="M" tone="light" size={34} /></View>
          <View style={styles.stackOverlap}><Avatar initials="+" tone="light" size={34} /></View>
        </View>
      </View>

      <View style={styles.gameBottom}>
        <Text variant="meta" style={styles.darkMuted}>03 / 04 PLAYERS</Text>
        <Text variant="label" style={styles.greenText}>VIEW GAME <Text style={styles.darkArrow}>↗</Text></Text>
      </View>
    </MotionPressable>
  );
}

function MatchRow({ time, place, detail, players }: { time: string; place: string; detail: string; players: string }) {
  return (
    <MotionPressable onPress={() => {}} style={({ pressed }) => [styles.matchRow, pressed && styles.pressed]}>
      <View style={styles.matchTime}><Text variant="label">{time}</Text><Text variant="meta" muted>TODAY</Text></View>
      <View style={styles.matchCopy}>
        <Text variant="title">{place}</Text>
        <Text variant="body" muted>{detail}</Text>
      </View>
      <View style={styles.matchRight}>
        <Text variant="meta" style={styles.greenText}>{players}</Text>
        <Arrow />
      </View>
    </MotionPressable>
  );
}

function Person({ initials, name, games, tone }: { initials: string; name: string; games: string; tone: 'dark' | 'green' | 'light' }) {
  return (
    <View style={styles.person}>
      <Avatar initials={initials} tone={tone} size={54} />
      <Text variant="title" style={styles.personName}>{name}</Text>
      <Text variant="meta" muted>{games}</Text>
    </View>
  );
}

export default function PlayScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text variant="label">BROCCOLI CLUB</Text>
            <Text variant="meta" muted style={styles.headerMeta}>HONG KONG · SATURDAY</Text>
          </View>
          <Avatar initials="J" tone="green" size={38} />
        </View>

        <View style={styles.intro}>
          <Text variant="meta" muted>YOUR CLUB, TODAY</Text>
          <Text variant="display" style={styles.introTitle}>PLAY<br />SOMETHING.</Text>
        </View>

        <GameCard />

        <View style={styles.pulse}>
          <View style={styles.pulseItem}>
            <Text style={styles.pulseNumber}>03</Text>
            <Text variant="meta" muted>PLAYERS LOOKING</Text>
          </View>
          <View style={styles.pulseRule} />
          <View style={styles.pulseItem}>
            <Text style={styles.pulseNumber}>02</Text>
            <Text variant="meta" muted>GAMES OPEN</Text>
          </View>
          <View style={styles.pulseRule} />
          <View style={styles.pulseItem}>
            <Text style={styles.pulseNumber}>01</Text>
            <Text variant="meta" muted>TONIGHT</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text variant="meta" muted>THE CLUB</Text>
              <Text variant="headline" style={styles.sectionTitle}>Open games</Text>
            </View>
            <Text variant="meta" muted>THIS WEEKEND</Text>
          </View>

          <MatchRow time="10—12" place="KOWLOON CRICKET CLUB" detail="Court 02 · Beginner / intermediate" players="02 / 04" />
          <MatchRow time="4—6" place="HAPPY VALLEY" detail="Court 01 · Intermediate singles" players="01 / 02" />

          <MotionPressable onPress={() => {}} style={({ pressed }) => [styles.allGames, pressed && styles.pressed]}>
            <Text variant="label">SEE ALL GAMES</Text>
            <Arrow />
          </MotionPressable>
        </View>

        <View style={styles.peopleSection}>
          <View style={styles.sectionHead}>
            <View>
              <Text variant="meta" muted>THE PEOPLE</Text>
              <Text variant="headline" style={styles.sectionTitle}>Your people</Text>
            </View>
            <Text variant="meta" muted>PLAYED TOGETHER</Text>
          </View>

          <View style={styles.peopleRow}>
            <Person initials="A" name="Alex" games="6 games" tone="green" />
            <Person initials="M" name="Maya" games="4 games" tone="dark" />
            <Person initials="D" name="Daniel" games="3 games" tone="light" />
            <Person initials="+" name="More" games="People" tone="light" />
          </View>
        </View>

        <MotionPressable onPress={() => {}} style={({ pressed }) => [styles.needPlayers, pressed && styles.pressed]}>
          <View>
            <Text variant="meta" muted>HAVE A COURT?</Text>
            <Text variant="headline" style={styles.needTitle}>Bring the club in.</Text>
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
  introTitle: { fontSize: 59, lineHeight: 51, letterSpacing: -1.8, marginTop: 7 },
  gameCard: { backgroundColor: colors.ink, padding: 16, minHeight: 420 },
  gameCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.signal },
  greenText: { color: colors.signal },
  darkMuted: { color: '#989D94' },
  gameVisual: { height: 190, marginTop: 4, position: 'relative', overflow: 'hidden' },
  courtMark: { position: 'absolute', right: -7, top: 8, width: 235, height: 175, borderWidth: 1, borderColor: '#3A3E38', transform: [{ rotate: '-8deg' }] },
  courtFrame: { position: 'absolute', left: 18, right: 18, top: 17, bottom: 17, borderWidth: 1, borderColor: '#666B62' },
  courtNet: { position: 'absolute', top: 17, bottom: 17, left: '50%', width: 1, backgroundColor: '#666B62' },
  courtCentre: { position: 'absolute', left: '25%', right: '25%', top: '50%', height: 1, backgroundColor: '#444941' },
  courtDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: colors.signal, left: '50%', top: '50%', marginLeft: -6, marginTop: -6 },
  courtSlash: { position: 'absolute', width: 150, height: 2, backgroundColor: colors.signal, left: 30, top: 90, transform: [{ rotate: '-25deg' }] },
  timeBlock: { position: 'absolute', left: 0, bottom: 0, zIndex: 2 },
  time: { color: colors.bone, fontSize: 100, lineHeight: 89, fontWeight: '800', letterSpacing: -5 },
  pm: { color: colors.bone, position: 'absolute', left: 105, bottom: 7 },
  gameInfo: { paddingTop: 14, borderTopWidth: 1, borderTopColor: '#30342F', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  gameCopy: { flex: 1, paddingRight: 10 },
  lightHeading: { color: colors.bone },
  darkBody: { color: '#B9BDB5', marginTop: 2 },
  peopleStack: { width: 95, height: 34, flexDirection: 'row', justifyContent: 'flex-end' },
  stackOverlap: { marginLeft: -8 },
  gameBottom: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#30342F', flexDirection: 'row', justifyContent: 'space-between' },
  darkArrow: { color: colors.signal, fontSize: 16 },
  arrow: { color: colors.ink, fontSize: 19, lineHeight: 20 },
  pulse: { marginTop: 0, minHeight: 82, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  pulseItem: { alignItems: 'center', flex: 1 },
  pulseNumber: { fontSize: 27, lineHeight: 27, fontWeight: '800' },
  pulseRule: { width: 1, height: 35, backgroundColor: colors.concrete },
  section: { marginTop: 44 },
  sectionHead: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { fontSize: 29, lineHeight: 30, marginTop: 2 },
  matchRow: { minHeight: 86, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center' },
  matchTime: { width: 58, gap: 2 },
  matchCopy: { flex: 1, paddingRight: 10 },
  matchRight: { alignItems: 'flex-end', gap: 5 },
  allGames: { minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  peopleSection: { marginTop: 44 },
  peopleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 19 },
  person: { width: '23%', alignItems: 'center' },
  personName: { fontSize: 13, marginTop: 7 },
  needPlayers: { marginTop: 44, minHeight: 118, padding: 16, backgroundColor: colors.white, borderTopWidth: 2, borderTopColor: colors.ink, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  needTitle: { marginTop: 3, fontSize: 27, lineHeight: 29 },
  needCopy: { marginTop: 3 },
  footer: { alignItems: 'center', marginTop: 44 },
  pressed: { opacity: 0.68 },
});
