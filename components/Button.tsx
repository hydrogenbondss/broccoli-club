import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
  disabled?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        <Text
          variant="label"
          style={{
            color: isPrimary ? colors.bone : colors.ink,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.concrete,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.4,
  },
});
