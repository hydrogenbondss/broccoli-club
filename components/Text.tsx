import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, typography } from '@/theme';

type TextVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'body'
  | 'label'
  | 'meta'
  | 'time';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  muted?: boolean;
};

export function Text({
  variant = 'body',
  muted = false,
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      {...props}
      style={[
        typography[variant],
        {
          color: muted ? colors.muted : colors.ink,
        },
        style,
      ]}
    />
  );
}
