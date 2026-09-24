import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
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
  gamesForPerson,
  gamesLabel,
  getCurrentUser,
  lastSharedGame,
  peoplePlayedWith,
  placesPlayedCount,
  sharedGames,
} from '@/data/mockPeople';
import { colors, spacing, typography } from '@/theme';

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function SharedGameRow({
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
      accessibilityLabel={`Open shared game at ${game.venue}, ${game.dateLabel}`}
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

/** PEOPLE home — relational club roster, not a profile dashboard. Route stays /profile. */
export default function PeopleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { games } = useGamesStore();
  const user = getCurrentUser();
  const myGames = gamesForPerson(CURRENT_USER_ID, games);
  const myPeople = peoplePlayedWith(CURRENT_USER_ID, games);
  const placesCount = placesPlayedCount(CURRENT_USER_ID, games);
  /** Recent shared fixtures that support relationship — keep short. */
  const recentShared = myGames.slice(0, 3);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 105 + insets.bottom },
        ]}
      >
        <Entrance>
          <View style={styles.identity}>
            <Text variant="headline" style={styles.name}>
              {user.name.toUpperCase()}
            </Text>
            <Text variant="meta" muted style={styles.clubLine}>
              BROCCOLI CLUB / HONG KONG
            </Text>
            <Text variant="meta" muted style={styles.quietIndex}>
              {fixtureLabel(myGames.length)} GAMES · {fixtureLabel(myPeople.length)} PEOPLE ·{' '}
              {fixtureLabel(placesCount)} PLACES
            </Text>
          </View>
        </Entrance>

        <Entrance delay={40}>
          <View style={styles.purpose}>
            <Text variant="meta" muted>
              THE PEOPLE
            </Text>
            <Text variant="headline" style={styles.purposeTitle}>
              {"People you've played with."}
            </Text>
          </View>
        </Entrance>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text variant="meta" muted>
                Roster
              </Text>
              <Text variant="headline" style={styles.sectionTitle}>
                Your people
              </Text>
            </View>
            <Text variant="meta" muted>
              {fixtureLabel(myPeople.length)}
            </Text>
          </View>

          {myPeople.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="body" muted>
                No people yet.
              </Text>
            </View>
          ) : (
            myPeople.map((person) => {
              const sharedCount = sharedGames(
                CURRENT_USER_ID,
                person.id,
                games,
              ).length;
              const last = lastSharedGame(CURRENT_USER_ID, person.id, games);
              const lastLine = last
                ? `LAST PLAYED · ${last.venue}`
                : 'LAST PLAYED · —';
              return (
                <MotionPressable
                  key={person.id}
                  onPress={() =>
                    router.push({ pathname: '/person/[id]', params: { id: person.id } })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${person.name}'s club record`}
                  style={({ pressed }) => [
                    styles.personRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.personCopy}>
                    <View style={styles.personMark}>
                      <BroccoliMark
                        tone="light"
                        compact
                        size={0.34}
                        animated={false}
                        accents={[{ index: person.markNode, state: 'active' }]}
                        activePresence="quiet"
                      />
                    </View>
                    <View style={styles.personText}>
                      <Text variant="title">{person.name.toUpperCase()}</Text>
                      <Text variant="meta" muted style={styles.personMeta}>
                        {gamesLabel(sharedCount).toUpperCase()} TOGETHER
                      </Text>
                      <Text variant="meta" muted style={styles.personLast}>
                        {lastLine}
                      </Text>
                    </View>
                  </View>
                  <Arrow />
                </MotionPressable>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text variant="meta" muted>
                Shared field
              </Text>
              <Text variant="headline" style={styles.sectionTitle}>
                Recent together
              </Text>
            </View>
            <Text variant="meta" muted>
              {fixtureLabel(recentShared.length)}
            </Text>
          </View>

          {recentShared.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="body" muted>
                No shared games yet.
              </Text>
            </View>
          ) : (
            recentShared.map((game, index) => (
              <SharedGameRow
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

        <View style={styles.footer}>
          <Text variant="body" muted>
            Club record · not a feed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  content: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.lg,
  },
  identity: {
    marginTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  name: {},
  clubLine: {
    marginTop: 8,
  },
  quietIndex: {
    marginTop: 10,
  },
  purpose: {
    paddingTop: 28,
    paddingBottom: 8,
  },
  purposeTitle: {
    marginTop: 4,
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
  personRow: {
    minHeight: 88,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    paddingRight: 10,
  },
  personMark: {
    width: 44,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  personText: { flex: 1, gap: 3 },
  personMeta: { marginTop: 2 },
  personLast: { marginTop: 1 },
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
  footer: { alignItems: 'center', marginTop: 44 },
  pressed: { opacity: 0.68 },
});
