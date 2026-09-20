import { useCallback, useState, type ReactNode } from 'react';

import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import * as Haptics from 'expo-haptics';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type HapticType = 'light' | 'medium' | 'selection' | 'none';

type MotionPressableProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  haptic?: HapticType;
};

export function MotionPressable({
  children,
  style,
  haptic = 'light',
  onPressIn,
  onPressOut,
  ...props
}: MotionPressableProps) {
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);

  const animate = useCallback(
    (value: number) => {
      // Reanimated SharedValues are intentionally mutable.
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withTiming(value, {
        duration: value === 1 ? 180 : 90,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
    },
    [scale],
  );

  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      setPressed(true);
      animate(0.975);

      if (haptic === 'light') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (haptic === 'medium') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (haptic === 'selection') {
        void Haptics.selectionAsync();
      }

      onPressIn?.(event);
    },
    [animate, haptic, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      setPressed(false);
      animate(1);
      onPressOut?.(event);
    },
    [animate, onPressOut],
  );

  const state = {
    pressed,
    hovered: false,
  } as PressableStateCallbackType;

  const resolvedStyle =
    typeof style === 'function' ? style(state) : style;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={undefined}
    >
      <Animated.View style={[resolvedStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}