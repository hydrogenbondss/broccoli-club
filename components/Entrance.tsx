import { useEffect, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/theme';

type EntranceProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  /** Skip animation (e.g. reduce-motion callers or archival lists). */
  disabled?: boolean;
};

/**
 * Quiet one-shot entrance: 8px rise + fade over ~180–240ms.
 * Not for whole-sheet or looping motion.
 */
export function Entrance({
  children,
  delay = 0,
  style,
  disabled = false,
}: EntranceProps) {
  const opacity = useSharedValue(disabled ? 1 : 0);
  const translateY = useSharedValue(disabled ? 0 : motion.entranceOffset);

  useEffect(() => {
    if (disabled) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const timing = {
      duration: motion.entrance,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    };

    opacity.value = withDelay(delay, withTiming(1, timing));
    translateY.value = withDelay(delay, withTiming(0, timing));
  }, [delay, disabled, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
