import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

type Filter = 'upcoming' | 'past';
const heroImage = require('../../2491b7e0ee7d0396d1645c54599d291e.jpg');

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function Marker({ active = false }: { active?: boolean }) {
  return <View style={[styles.marker, active && styles.markerActive]} />;
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

        <Text variant="display" style={styles.pageTitle}>GAMES</Text>

        <MotionPressable haptic="medium" onPress={() => {}} style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroShade} />
          <View style={styles.heroTop}>
            <View style={styles.heroTag}><Marker active /><Text variant="meta" style={styles.lightText}>NEXT GAME</Text></View>
            <Text variant="meta" style={styles.lightMuted}>SUN · 20 SEP</Text>
          </View>
          <View style={styles.heroBottom}>
            <View>
              <Text variant="meta" style={styles.lightMuted}>4—6 PM</Text>
              <Text variant="headline" style={styles.heroPlace}>VICTORIA PARK</Text>
              <Text variant="body" style={styles.heroDetail}>Court 03 · Intermediate doubles</Text>
            </View>
            <Arrow />
          </View>
          <View style={styles.heroFooter}>
            <View><Text variant="meta" style={styles.lightMuted}>PLAYERS</Text><Text variant="label" style={styles.lightText}>03 / 04</Text></View>
            <View><Text variant="meta" style={styles.lightMuted}>ENTRY</Text><Text variant="label" style={styles.lightText}>HK$25</Text></View>
            <View style={styles.inButton}><Text variant="label" style={styles.inButtonText}>YOU'RE IN</Text></View>
          </View>
        </MotionPressable>

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
  pageTitle: { fontSize: 62, lineHeight: 58, marginTop: 24, marginBottom: 18 },
  hero: { height: 430, backgroundColor: colors.ink, overflow: 'hidden' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)' },
  heroTop: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  marker: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  markerActive: { backgroundColor: colors.signal },
  lightText: { color: colors.bone },
  lightMuted: { color: '#C0C3BB' },
  heroBottom: { position: 'absolute', left: 16, right: 16, bottom: 74, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroPlace: { color: colors.bone, marginTop: 3 },
  heroDetail: { color: '#D0D2CC', marginTop: 2 },
  heroFooter: { position: 'absolute', left: 16, right: 16, bottom: 0, minHeight: 58, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.22)', flexDirection: 'row', alignItems: 'center', gap: 24 },
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