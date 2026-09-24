import { useEffect, useRef, useState, type ComponentProps } from 'react';

import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/Text';
import { motion } from '@/theme';

type TextProps = ComponentProps<typeof Text>;

type StateFadeTextProps = Omit<TextProps, 'children'> & {
  /** Canonical label — always drives a11y; visual may lag briefly during crossfade. */
  value: string;
};

/**
 * Quiet crossfade when a state label or count changes.
 * Timing: ~fast out + remainder of standard in. No bounce.
 * Text/state updates for a11y use `value` immediately.
 */
export function StateFadeText({ value, style, ...textProps }: StateFadeTextProps) {
  const opacity = useSharedValue(1);
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;

    const outMs = Math.round(motion.fast / 2);
    const inMs = motion.standard - outMs;
    const ease = Easing.out(Easing.quad);

    opacity.value = withTiming(
      0,
      { duration: outMs, easing: ease, reduceMotion: ReduceMotion.System },
      (finished) => {
        if (!finished) return;
        runOnJS(setDisplay)(value);
        opacity.value = withTiming(1, {
          duration: inMs,
          easing: ease,
          reduceMotion: ReduceMotion.System,
        });
      },
    );
  }, [opacity, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        {...textProps}
        style={style}
        accessibilityLabel={value}
      >
        {display}
      </Text>
    </Animated.View>
  );
}
