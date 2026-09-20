import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

type SectionHeaderProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  action,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="label">{title}</Text>

      {action ? (
        <Text
          variant="label"
          onPress={onActionPress}
          style={styles.action}
        >
          {action}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  action: {
    color: colors.broccoli,
  },
});
