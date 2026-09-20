import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

type GameCardProps = {
  date: string;
  time: string;
  venue: string;
  format: string;
  level: string;
  players: string;
  cost?: string;
  status?: string;
  actionLabel?: string;
  onPress?: () => void;
};

export function GameCard({
  date,
  time,
  venue,
  format,
  level,
  players,
  cost,
  status,
  actionLabel,
  onPress,
}: GameCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.top}>
        <Text variant="label">{date}</Text>
        {status ? (
          <Text variant="meta" style={styles.status}>
            {status}
          </Text>
        ) : null}
      </View>

      <Text variant="headline" style={styles.time}>
        {time}
      </Text>

      <View style={styles.rule} />

      <Text variant="title">{venue}</Text>

      <View style={styles.details}>
        <Text variant="body">{level}</Text>
        <Text variant="body" muted>
          {format}
        </Text>
      </View>

      <View style={styles.bottom}>
        <Text variant="label">{players}</Text>

        {cost ? (
          <Text variant="label">{cost}</Text>
        ) : null}
      </View>

      {actionLabel ? (
        <View style={styles.action}>
          <Text variant="label" style={styles.actionText}>
            {actionLabel}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink,
    padding: spacing.xl,
  },
  pressed: {
    opacity: 0.72,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    color: colors.broccoli,
  },
  time: {
    marginTop: spacing.sm,
  },
  rule: {
    height: 1,
    backgroundColor: colors.concrete,
    marginVertical: spacing.lg,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  action: {
    borderTopWidth: 1,
    borderTopColor: colors.concrete,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  actionText: {
    color: colors.broccoli,
  },
});
