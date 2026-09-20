import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

type Filter = 'upcoming' | 'past';

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function Marker({ active = false }: { active?: boolean }) {
  return <View style={[styles.marker, active && styles.markerActive]} />;
}

function CourtGraphic() {
  return (
    <View style={styles.court}>
      <View style={styles.courtOuter} />
      <View style={styles.courtNet} />
      <View style={[styles.courtLine, styles.courtLineTop]} />
      <View style={[styles.courtLine, styles.courtLineBottom]} />
      <View style={[styles.courtLine, styles.courtLineLeft]} />
      <View style={[styles.courtLine, styles.courtLineRight]} />
      <View style={styles.courtDot} />
    </View>
  );
}

function HeroGame() {
  return (
    <MotionPressable haptic="medium" onPress={() => {}} style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
      <View style={styles.heroHead}>
        <View style={styles.heroDate}>
          <Text variant="meta" muted>SEP</Text>
          <Text style={styles.heroDay}>20</Text>
          <Text variant="meta" muted>SUN</Text>
        </View>
        <View style={styles.heroMeta}>
          <View style={styles.liveLine}><Marker active /><Text variant="meta" style={styles.signalText}>NEXT GAME</Text></View>
          <Text variant="meta" muted>04—06 PM</Text>
        </View>
      </View>

      <CourtGraphic />

      <View style={styles.heroCopy}>
        <View style={styles.heroVenue}>
          <Text variant="headline" style={styles.heroPlace}>VICTORIA PARK</Text>
          <Text variant="body" muted style={styles.heroDetail}>Court 03 · Intermediate doubles</Text>
        </View>
        <Arrow />
      </View>

      <View style={styles.heroFooter}>
        <View style={styles.heroStat}><Text variant="meta" muted>PLAYERS</Text><Text variant="label">03 / 04</Text></View>
        <View style={styles.heroStat}><Text variant="meta" muted>ENTRY</Text><Text variant="label">HK$25</Text></View>
        <View style={styles.inButton}><Text variant="label" style={styles.inButtonText}>YOU'RE IN</Text></View>
      </View>
    </MotionPressable>
  );
}

function GameRow({ index, date, place, detail, players, status, price, past = false }: {
  index: number; date: string; place: string; detail: string; players: string; status: string; price?: string; past?: boolean;
}) {
  return (
    <MotionPressable haptic="selection" onPress={() => {}} style={({ pressed }) => [styles.gameRow, past && styles.gameRowPast, pressed && styles.pressed]}>
      <View style={styles.rowNumber}><Text variant="meta" muted={past}>0{index + 1}</Text></View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text variant="meta" muted={past}>{date}</Text>
          <View style={styles.status}><Marker active={!past} /><Text variant="meta" style={past ? styles.mutedText : styles.openText}>{status}</Text></View>
        </View>
        <View style={styles.rowMain}>
          <View style={styles.rowCopy}>
            <Text variant="title">{place}</Text>
            <Text variant="body" muted style={styles.detail}>{detail}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text variant="meta" muted>{players}</Text>
            {price ? <Text variant="label" style={styles.price}>{price}</Text> : <Arrow />}
          </View>
        </View>
      </View>
    </MotionPressable>
  );
}

function FilterButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <MotionPressable haptic="selection" onPress={onPress} style={({ pressed }) => [styles.filter, active && styles.filterActive, pressed && styles.pressed]}>
      <Text variant="label" style={active ? styles.filterActiveText : styles.filterText}>{label}</Text>
    </MotionPressable>
  );
}

export default function GamesScreen() {
  const [filter, setFilter] = useState<Filter>('upcoming');

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text variant="label">BROCCOLI CLUB</Text>
            <Text variant="meta" muted style={styles.headerSub}>GAMES / HONG KONG</Text>
          </View>
          <Text variant="meta" muted>02</Text>
        </View>

        <View style={styles.titleRow}>
          <Text variant="display" style={styles.pageTitle}>GAMES</Text>
          <Text variant="meta" style={styles.titleCount}>03 LIVE</Text>
        </View>

        <HeroGame />

        <View style={styles.filters}>
          <FilterButton label="UPCOMING" active={filter === 'upcoming'} onPress={() => setFilter('upcoming')} />
          <FilterButton label="PAST" active={filter === 'past'} onPress={() => setFilter('past')} />
        </View>

        <View style={styles.sectionHead}>
          <View>
            <Text variant="meta" muted>THE FIELD</Text>
            <Text variant="headline" style={styles.sectionTitle}>{filter === 'upcoming' ? 'Open games' : 'Played games'}</Text>
          </View>
          <Text variant="meta" muted>{filter === 'upcoming' ? '02 OPEN' : '02 LOGGED'}</Text>
        </View>

        {filter === 'upcoming' ? <>
          <GameRow index={0} date="SUN · 21 SEP" place="Kowloon Cricket Club" detail="Court 02 · Beginner / intermediate" players="02 / 04" status="OPEN" price="HK$25" />
          <GameRow index={1} date="SUN · 21 SEP" place="Happy Valley" detail="Court 01 · Intermediate singles" players="01 / 02" status="OPEN" price="HK$30" />
        </> : <>
          <GameRow index={0} date="SAT · 13 SEP" place="Happy Valley" detail="Court 01 · Intermediate singles" players="02 / 02" status="PLAYED" past />
          <GameRow index={1} date="SUN · 07 SEP" place="Victoria Park" detail="Court 04 · Intermediate doubles" players="04 / 04" status="PLAYED" past />
        </>}

        {filter === 'upcoming' && (
          <MotionPressable haptic="medium" onPress={() => {}} style={({ pressed }) => [styles.find, pressed && styles.pressed]}>
            <View><Text variant="meta" muted>HONG KONG / NOW</Text><Text variant="headline" style={styles.findTitle}>Find another game</Text></View>
            <Arrow />
          </MotionPressable>
        )}

        <View style={styles.footer}><Text variant="meta" muted>BROCCOLI CLUB / NEVER JUST A SIDE</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerSub: { marginTop: 5 },
  titleRow: { marginTop: 22, marginBottom: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  pageTitle: { fontSize: 62, lineHeight: 58 },
  titleCount: { color: colors.signal, marginBottom: 5 },
  hero: { minHeight: 430, backgroundColor: colors.ink, padding: 16, overflow: 'hidden' },
  heroHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroDate: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  heroDay: { color: colors.bone, fontSize: 72, lineHeight: 68, fontWeight: '800', letterSpacing: -4 },
  heroMeta: { alignItems: 'flex-end', gap: 7, paddingTop: 3 },
  liveLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  signalText: { color: colors.signal },
  marker: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  markerActive: { backgroundColor: colors.signal },
  court: { height: 170, marginTop: 8, position: 'relative', borderWidth: 1, borderColor: 'rgba(240,242,236,0.48)', backgroundColor: 'rgba(240,242,236,0.035)' },
  courtOuter: { position: 'absolute', left: 13, right: 13, top: 13, bottom: 13, borderWidth: 1, borderColor: 'rgba(240,242,236,0.72)' },
  courtNet: { position: 'absolute', top: 13, bottom: 13, left: '50%', width: 1, backgroundColor: 'rgba(240,242,236,0.72)' },
  courtLine: { position: 'absolute', backgroundColor: 'rgba(240,242,236,0.5)' },
  courtLineTop: { left: '25%', right: '25%', top: '50%', height: 1 },
  courtLineBottom: { left: '25%', right: '25%', bottom: '50%', height: 1 },
  courtLineLeft: { top: '30%', bottom: '30%', left: '25%', width: 1 },
  courtLineRight: { top: '30%', bottom: '30%', right: '25%', width: 1 },
  courtDot: { position: 'absolute', width: 11, height: 11, borderRadius: 6, backgroundColor: colors.signal, left: '50%', top: '50%', marginLeft: -5.5, marginTop: -5.5 },
  heroCopy: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroVenue: { flex: 1, paddingRight: 12 },
  heroPlace: { color: colors.bone },
  heroDetail: { color: '#B9BCB4', marginTop: 3 },
  heroFooter: { minHeight: 58, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(240,242,236,0.24)', flexDirection: 'row', alignItems: 'center', gap: 23 },
  heroStat: { gap: 3 },
  inButton: { marginLeft: 'auto', minHeight: 38, paddingHorizontal: 13, backgroundColor: colors.signal, justifyContent: 'center' },
  inButtonText: { color: colors.bone },
  arrow: { fontSize: 20, lineHeight: 20, color: colors.ink },
  filters: { marginTop: 25, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row' },
  filter: { minHeight: 43, marginRight: 25, justifyContent: 'center' },
  filterActive: { borderBottomWidth: 2, borderBottomColor: colors.ink },
  filterText: { color: colors.muted },
  filterActiveText: { color: colors.ink },
  sectionHead: { marginTop: 28, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { marginTop: 3, fontSize: 30, lineHeight: 30 },
  gameRow: { minHeight: 118, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row' },
  gameRowPast: { opacity: 0.55 },
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
  price: { color: colors.signal },
  find: { minHeight: 94, marginTop: 25, paddingVertical: 17, borderTopWidth: 2, borderTopColor: colors.ink, borderBottomWidth: 1, borderBottomColor: colors.concrete, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  findTitle: { marginTop: 3, fontSize: 25, lineHeight: 27 },
  footer: { alignItems: 'center', marginTop: 34 },
  pressed: { opacity: 0.72 },
});
