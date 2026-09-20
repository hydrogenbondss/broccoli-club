import { FlatList, StyleSheet, View } from 'react-native';
import { MotionPressable } from '@/components/MotionPressable';
import { colors, spacing } from '@/theme';
import { Text } from '@/components/Text';

function Avatar({
  initials,
  tone = 'dark',
  size = 48,
}: {
  initials: string;
  tone?: 'dark' | 'green' | 'light';
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        tone === 'dark' && styles.avatarDark,
        tone === 'green' && styles.avatarGreen,
        tone === 'light' && styles.avatarLight,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text
        variant="label"
        style={
          tone === 'dark'
            ? styles.avatarDarkText
            : tone === 'green'
              ? styles.avatarGreenText
              : styles.avatarLightText
        }
      >
        {initials}
      </Text>
    </View>
  );
}

function Arrow() {
  return <Text style={styles.arrow}>↗</Text>;
}

function GameRow({
  place,
  time,
  details,
  players,
}: {
  place: string;
  time: string;
  details: string;
  players: string;
}) {
  return (
    <MotionPressable
      onPress={() => {}}
      style={({ pressed }) => [
        styles.gameRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.gameRowMain}>
        <Text variant="title">{place}</Text>

        <Text variant="body" muted>
          {time} · {details}
        </Text>
      </View>

      <View style={styles.gameRowSide}>
        <Text variant="meta" style={styles.green}>
          {players}
        </Text>
        <Arrow />
      </View>
    </MotionPressable>
  );
}

function ActionLink({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <MotionPressable
      onPress={() => {}}
      style={({ pressed }) => [
        styles.actionLink,
        pressed && styles.pressed,
      ]}
    >
      <View>
        <Text variant="title">{title}</Text>
        <Text variant="body" muted>
          {subtitle}
        </Text>
      </View>

      <Arrow />
    </MotionPressable>
  );
}

export default function PlayScreen() {
  const listData = ['content'];

  return (
    <View style={styles.screen}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.list}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text variant="label">Broccoli Club</Text>
                <Text variant="meta" muted style={styles.headerMeta}>
                  Hong Kong
                </Text>
              </View>

              <Avatar initials="J" tone="green" size={38} />
            </View>

            <View style={styles.greeting}>
              <Text variant="body" muted>
                Saturday, 20 September
              </Text>

              <Text variant="headline" style={styles.greetingTitle}>
                Good afternoon, Jeffrey.
              </Text>

              <Text variant="body" muted style={styles.greetingCopy}>
                Ready to play?
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureTop}>
                <Text variant="meta">YOUR NEXT GAME</Text>

                <View style={styles.inPill}>
                  <View style={styles.inDot} />
                  <Text variant="meta" style={styles.inText}>
                    YOU’RE IN
                  </Text>
                </View>
              </View>

              <View style={styles.featureBody}>
                <View style={styles.featureTime}>
                  <Text variant="display">4–6</Text>
                  <Text variant="body" muted style={styles.featurePm}>
                    pm
                  </Text>
                </View>

                <View style={styles.avatarCluster}>
                  <View style={styles.clusterOne}>
                    <Avatar initials="J" tone="dark" size={48} />
                  </View>
                  <View style={styles.clusterTwo}>
                    <Avatar initials="A" tone="green" size={48} />
                  </View>
                  <View style={styles.clusterThree}>
                    <Avatar initials="M" tone="light" size={48} />
                  </View>
                  <View style={styles.clusterFour}>
                    <Avatar initials="+" tone="light" size={48} />
                  </View>
                </View>
              </View>

              <View style={styles.featureInfo}>
                <View>
                  <Text variant="title">Victoria Park</Text>
                  <Text variant="body" muted>
                    Court 03 · Intermediate doubles
                  </Text>
                </View>

                <Text variant="label" style={styles.price}>
                  HK$30
                </Text>
              </View>

              <MotionPressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.featureAction,
                  pressed && styles.pressed,
                ]}
              >
                <Text variant="label">View game</Text>
                <Arrow />
              </MotionPressable>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text variant="headline" style={styles.sectionTitle}>
                  Around Broccoli
                </Text>

                <Text variant="meta" muted>
                  This weekend
                </Text>
              </View>

              <View style={styles.rows}>
                <GameRow
                  place="Victoria Park"
                  time="Sat · 5–7 pm"
                  details="Intermediate doubles"
                  players="3 / 4"
                />

                <GameRow
                  place="Kowloon Cricket Club"
                  time="Sun · 10–12"
                  details="Beginner / intermediate"
                  players="2 / 4"
                />

                <GameRow
                  place="Happy Valley"
                  time="Sun · 4–6 pm"
                  details="Intermediate singles"
                  players="1 / 2"
                />
              </View>
            </View>

            <View style={styles.peopleSection}>
              <View style={styles.sectionHeading}>
                <Text variant="headline" style={styles.sectionTitle}>
                  Your people
                </Text>

                <Text variant="meta" muted>
                  Played together
                </Text>
              </View>

              <View style={styles.peopleRow}>
                <View style={styles.person}>
                  <Avatar initials="A" tone="green" size={58} />
                  <Text variant="title" style={styles.personName}>
                    Alex
                  </Text>
                  <Text variant="meta" muted>
                    6 games
                  </Text>
                </View>

                <View style={styles.person}>
                  <Avatar initials="M" tone="dark" size={58} />
                  <Text variant="title" style={styles.personName}>
                    Maya
                  </Text>
                  <Text variant="meta" muted>
                    4 games
                  </Text>
                </View>

                <View style={styles.person}>
                  <Avatar initials="D" tone="light" size={58} />
                  <Text variant="title" style={styles.personName}>
                    Daniel
                  </Text>
                  <Text variant="meta" muted>
                    3 games
                  </Text>
                </View>

                <View style={styles.person}>
                  <Avatar initials="+" tone="light" size={58} />
                  <Text variant="title" style={styles.personName}>
                    More
                  </Text>
                  <Text variant="meta" muted>
                    People
                  </Text>
                </View>
              </View>

              <MotionPressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.playAgain,
                  pressed && styles.pressed,
                ]}
              >
                <Text variant="label" style={styles.green}>
                  Play again
                </Text>
                <Arrow />
              </MotionPressable>
            </View>

            <View style={styles.requestSection}>
              <View style={styles.sectionHeading}>
                <Text variant="headline" style={styles.sectionTitle}>
                  Looking to play?
                </Text>

                <View style={styles.activeMark} />
              </View>

              <View style={styles.request}>
                <Text variant="title">Saturday · 4–6 pm</Text>

                <Text variant="body" muted style={styles.requestCopy}>
                  Hong Kong Island · Intermediate doubles
                </Text>

                <View style={styles.requestBottom}>
                  <Text variant="meta" muted>
                    ACTIVE
                  </Text>

                  <MotionPressable onPress={() => {}}>
                    <Text variant="label" style={styles.green}>
                      Edit →
                    </Text>
                  </MotionPressable>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <ActionLink
                title="Find a game"
                subtitle="See who’s playing when you want to play."
              />

              <ActionLink
                title="Need players"
                subtitle="Have a court? Fill the empty spots."
              />
            </View>

            <View style={styles.footer}>
              <Text variant="body" muted>
                Never just a side.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bone,
  },

  list: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerMeta: {
    marginTop: 2,
  },

  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarDark: {
    backgroundColor: colors.ink,
  },

  avatarGreen: {
    backgroundColor: colors.broccoli,
  },

  avatarLight: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.concrete,
  },

  avatarDarkText: {
    color: colors.bone,
  },

  avatarGreenText: {
    color: colors.bone,
  },

  avatarLightText: {
    color: colors.ink,
  },

  greeting: {
    marginTop: 38,
  },

  greetingTitle: {
    marginTop: 7,
  },

  greetingCopy: {
    marginTop: 3,
  },

  feature: {
    marginTop: 28,
    paddingTop: 17,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },

  featureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  inDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.broccoli,
  },

  inText: {
    color: colors.broccoli,
  },

  featureBody: {
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  featureTime: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  featurePm: {
    marginBottom: 5,
    marginLeft: 5,
  },

  avatarCluster: {
    width: 135,
    height: 105,
    position: 'relative',
  },

  clusterOne: {
    position: 'absolute',
    left: 4,
    top: 15,
    zIndex: 4,
  },

  clusterTwo: {
    position: 'absolute',
    left: 36,
    top: 0,
    zIndex: 3,
  },

  clusterThree: {
    position: 'absolute',
    left: 67,
    top: 19,
    zIndex: 2,
  },

  clusterFour: {
    position: 'absolute',
    left: 39,
    top: 50,
    zIndex: 1,
  },

  featureInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.concrete,
  },

  price: {
    color: colors.broccoli,
  },

  featureAction: {
    minHeight: 46,
    marginTop: 15,
    paddingHorizontal: 16,
    backgroundColor: colors.broccoli,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  arrow: {
    fontSize: 20,
    lineHeight: 22,
    color: colors.ink,
  },

  section: {
    marginTop: 46,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },

  sectionTitle: {
    fontSize: 27,
    lineHeight: 29,
  },

  rows: {
    marginTop: 2,
  },

  gameRow: {
    minHeight: 76,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  gameRowMain: {
    flex: 1,
    paddingRight: 16,
  },

  gameRowSide: {
    alignItems: 'flex-end',
    gap: 5,
  },

  green: {
    color: colors.broccoli,
  },

  peopleSection: {
    marginTop: 46,
  },

  peopleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },

  person: {
    alignItems: 'center',
    width: '23%',
  },

  personName: {
    marginTop: 7,
    fontSize: 13,
  },

  playAgain: {
    minHeight: 42,
    marginTop: 17,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  requestSection: {
    marginTop: 46,
  },

  activeMark: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.broccoli,
    marginBottom: 7,
  },

  request: {
    paddingTop: 16,
  },

  requestCopy: {
    marginTop: 4,
  },

  requestBottom: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actions: {
    marginTop: 45,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },

  actionLink: {
    minHeight: 82,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footer: {
    alignItems: 'center',
    marginTop: 45,
    paddingTop: 4,
  },

  pressed: {
    opacity: 0.65,
  },
});
