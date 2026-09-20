import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

type Filter = 'upcoming' | 'past';

function StatusDot() {
  return <View style={styles.statusDot} />;
}

function GameCard({
  date,
  time,
  venue,
  format,
  players,
  status,
  cost,
  past = false,
}: {
  date: string;
  time: string;
  venue: string;
  format: string;
  players: string;
  status: string;
  cost?: string;
  past?: boolean;
}) {
  return (
    <MotionPressable
      onPress={() => {}}
      style={({ pressed }) => [
        styles.card,
        past && styles.cardPast,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <Text variant="label">{date}</Text>

        <View style={styles.status}>
          {!past ? <StatusDot /> : null}
          <Text
            variant="meta"
            style={past ? styles.pastStatus : styles.activeStatus}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text variant="display" style={styles.time}>
          {time}
        </Text>
      </View>

      <View style={styles.rule} />

      <Text variant="title">{venue}</Text>

      <Text variant="body" muted style={styles.format}>
        {format}
      </Text>

      <View style={styles.cardFooter}>
        <Text variant="meta" muted>
          {players}
        </Text>

        {cost ? (
          <Text variant="label" style={styles.cost}>
            {cost}
          </Text>
        ) : null}
      </View>
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
              YOUR GAMES
            </Text>
          </View>

          <Text variant="meta" muted>
            3 TOTAL
          </Text>
        </View>

        <View style={styles.intro}>
          <Text variant="headline">Games</Text>
          <Text variant="body" muted style={styles.introCopy}>
            Keep track of where you’ve played and what’s next.
          </Text>
        </View>

        <View style={styles.filterBar}>
          <MotionPressable
            onPress={() => setFilter('upcoming')}
            style={({ pressed }) => [
              styles.filter,
              filter === 'upcoming' && styles.filterActive,
              pressed && styles.pressed,
            ]}
          >
            <Text
              variant="label"
              style={
                filter === 'upcoming'
                  ? styles.filterActiveText
                  : styles.filterText
              }
            >
              UPCOMING
            </Text>
          </MotionPressable>

          <MotionPressable
            onPress={() => setFilter('past')}
            style={({ pressed }) => [
              styles.filter,
              filter === 'past' && styles.filterActive,
              pressed && styles.pressed,
            ]}
          >
            <Text
              variant="label"
              style={
                filter === 'past' ? styles.filterActiveText : styles.filterText
              }
            >
              PAST
            </Text>
          </MotionPressable>
        </View>

        <View style={styles.section}>
          {filter === 'upcoming' ? (
            <>
              <GameCard
                date="SATURDAY · 20 SEP"
                time="4–6"
                venue="Victoria Park"
                format="Court 03 · Intermediate doubles"
                players="3 / 4 PLAYERS"
                status="YOU’RE IN"
                cost="HK$30"
              />

              <GameCard
                date="SUNDAY · 21 SEP"
                time="10–12"
                venue="Kowloon Cricket Club"
                format="Court 02 · Beginner / intermediate"
                players="2 / 4 PLAYERS"
                status="OPEN"
                cost="HK$25"
              />

              <MotionPressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.findGame,
                  pressed && styles.pressed,
                ]}
              >
                <View>
                  <Text variant="title">Find another game</Text>
                  <Text variant="body" muted style={styles.findGameCopy}>
                    See what’s happening around Hong Kong.
                  </Text>
                </View>
                <Text variant="body" style={styles.arrow}>
                  ↗
                </Text>
              </MotionPressable>
            </>
          ) : (
            <>
              <GameCard
                date="SATURDAY · 13 SEP"
                time="4–6"
                venue="Happy Valley"
                format="Court 01 · Intermediate singles"
                players="2 PLAYERS"
                status="PLAYED"
                past
              />

              <GameCard
                date="SUNDAY · 7 SEP"
                time="2–4"
                venue="Victoria Park"
                format="Court 04 · Intermediate doubles"
                players="4 PLAYERS"
                status="PLAYED"
                past
              />
            </>
          )}
        </View>

        <View style={styles.note}>
          <Text variant="meta" muted>
            YOUR HISTORY
          </Text>
          <Text variant="body" style={styles.noteCopy}>
            Games become part of your player history.
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMeta: {
    marginTop: 2,
  },
  intro: {
    marginTop: 38,
  },
  introCopy: {
    marginTop: 6,
    maxWidth: 330,
  },
  filterBar: {
    flexDirection: 'row',
    marginTop: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  filter: {
    minHeight: 38,
    paddingHorizontal: 2,
    marginRight: 22,
    justifyContent: 'center',
  },
  filterActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  filterText: {
    color: colors.muted,
  },
  filterActiveText: {
    color: colors.ink,
  },
  section: {
    marginTop: 18,
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink,
    marginBottom: 14,
  },
  cardPast: {
    opacity: 0.84,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.broccoli,
  },
  activeStatus: {
    color: colors.broccoli,
  },
  pastStatus: {
    color: colors.muted,
  },
  timeRow: {
    marginTop: 12,
  },
  time: {
    fontSize: 48,
    lineHeight: 45,
  },
  rule: {
    height: 1,
    backgroundColor: colors.concrete,
    marginVertical: 14,
  },
  format: {
    marginTop: 3,
  },
  cardFooter: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cost: {
    color: colors.broccoli,
  },
  findGame: {
    minHeight: 75,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  findGameCopy: {
    marginTop: 3,
  },
  arrow: {
    fontSize: 20,
    lineHeight: 22,
  },
  note: {
    marginTop: 38,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
  noteCopy: {
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    marginTop: 45,
  },
  pressed: {
    opacity: 0.65,
  },
});
