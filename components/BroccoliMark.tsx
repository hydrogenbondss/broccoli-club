import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion } from '@/theme';

type MarkState = 'default' | 'open' | 'active' | 'resolved';

type Accent = {
  index: number;
  state: Exclude<MarkState, 'default'>;
};

type BroccoliMarkProps = {
  accents?: Accent[];
  compact?: boolean;
  /**
   * false (default) = still on mount; accent *changes* still ignite/resolve once.
   * true | 'once' = also pulse once on mount when accents are already present.
   * No infinite looping.
   */
  animated?: boolean | 'once';
  tone?: 'light' | 'dark';
  /** Overall scale. 1 = default mark size for the compact/default preset. */
  size?: number;
  /**
   * How strongly an active accent reads.
   * full = primary status node; quiet = secondary / atmospheric (smaller, softer).
   */
  activePresence?: 'full' | 'quiet';
};

type FixtureMarkGame = {
  joined: boolean;
  currentUserState: string;
  status: string;
  playersCurrent: number;
  playersMax: number;
};

/**
 * Derive constellation accents from GamesStore fixture state.
 * joined + open capacity → active; joined + full → resolved; else none.
 */
export function fixtureMarkAccents(game: FixtureMarkGame): Accent[] {
  const isIn = game.joined || game.currentUserState === 'in';
  if (!isIn) return [];
  const full =
    game.status === 'FULL' || game.playersCurrent >= game.playersMax;
  return [{ index: 10, state: full ? 'resolved' : 'active' }];
}

function accentSignature(accents: Accent[]): string {
  return accents.map((a) => `${a.index}:${a.state}`).join('|');
}

/**
 * Plotted crown → body nodes. Organic contour, less lattice-like.
 * Stem is a separate object — no bottom stem nodes.
 */
const NODES = [
  [48, 5],
  [36, 11], [59, 13],
  [24, 19], [43, 22], [54, 17], [73, 24],
  [14, 30], [31, 33], [47, 28], [63, 32], [81, 29],
  [9, 41], [23, 44], [37, 38], [51, 43], [66, 40], [86, 46],
  [16, 53], [30, 55], [48, 50], [65, 54], [77, 51],
  [27, 63], [40, 60], [57, 64], [71, 61],
  [39, 72], [55, 70],
] as const;

/** Sparse weight multipliers — a few heavier/lighter nodes only. */
const NODE_WEIGHT: Record<number, number> = {
  0: 1.22,
  4: 0.82,
  10: 1.18,
  14: 0.78,
  16: 1.15,
  22: 0.85,
  25: 1.2,
  27: 0.8,
};

const timing = {
  easing: Easing.out(Easing.quad),
  reduceMotion: ReduceMotion.System,
} as const;

function MarkNode({
  x,
  y,
  state,
  size,
  pulse,
  presence,
  foreground,
  quietActive,
}: {
  x: number;
  y: number;
  state: MarkState;
  size: number;
  pulse: SharedValue<number>;
  presence: SharedValue<number>;
  foreground: string;
  quietActive: boolean;
}) {
  const nodeSize = state === 'active' && quietActive ? size * 0.82 : size;

  const animatedStyle = useAnimatedStyle(() => {
    const accented = state === 'active' || state === 'resolved';
    return {
      transform: [{ scale: accented ? pulse.value : 1 }],
      opacity: state === 'active' ? presence.value : 1,
    };
  });

  const core = Math.max(2, Math.round(nodeSize * 0.28));
  const resolvedCore = Math.max(3, Math.round(nodeSize * 0.45));
  const coreInset = (nodeSize - core) / 2;
  const resolvedInset = (nodeSize - resolvedCore) / 2;

  return (
    <Animated.View
      style={[
        styles.node,
        {
          left: `${x}%`,
          top: `${y}%`,
          width: nodeSize,
          height: nodeSize,
          marginLeft: -nodeSize / 2,
          marginTop: -nodeSize / 2,
          backgroundColor: foreground,
        },
        state === 'open' && [
          styles.open,
          {
            backgroundColor: 'transparent',
            borderColor: colors.signal,
          },
        ],
        state === 'active' && styles.active,
        state === 'active' && quietActive && styles.activeQuiet,
        state === 'resolved' && [
          styles.resolved,
          {
            backgroundColor: 'transparent',
            borderColor: foreground,
          },
        ],
        animatedStyle,
      ]}
    >
      {state === 'active' && (
        <View
          style={[
            styles.activeCore,
            {
              width: core,
              height: core,
              left: coreInset,
              top: coreInset,
            },
          ]}
        />
      )}
      {state === 'resolved' && (
        <View
          style={[
            styles.resolvedCore,
            {
              width: resolvedCore,
              height: resolvedCore,
              left: resolvedInset,
              top: resolvedInset,
              backgroundColor: foreground,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

export function BroccoliMark({
  accents = [],
  compact = false,
  animated = false,
  tone = 'light',
  size = 1,
  activePresence = 'full',
}: BroccoliMarkProps) {
  const pulse = useSharedValue(1);
  const presence = useSharedValue(activePresence === 'quiet' ? 0.72 : 1);
  const prevSig = useRef<string | null>(null);
  const settlePresence = activePresence === 'quiet' ? 0.72 : 1;

  const accentSig = accentSignature(accents);
  const hasActiveAccent = accents.some((a) => a.state === 'active');
  const hasResolvedAccent = accents.some((a) => a.state === 'resolved');

  useEffect(() => {
    const prev = prevSig.current;
    const hasActive = hasActiveAccent;
    const hasResolved = hasResolvedAccent;
    const sig = accentSig;
    prevSig.current = sig;

    const ignite = () => {
      // Subtle grow + signal presence rise, then quiet active. ~standard/important.
      pulse.value = withSequence(
        withTiming(1.12, { duration: motion.fast, ...timing }),
        withTiming(1, { duration: motion.standard, ...timing }),
      );
      presence.value = withSequence(
        withTiming(1, { duration: motion.fast, ...timing }),
        withTiming(settlePresence, { duration: motion.important, ...timing }),
      );
    };

    const resolve = () => {
      // One-shot settle into resolved — not a loop.
      pulse.value = withSequence(
        withTiming(1.08, { duration: motion.fast, ...timing }),
        withTiming(1, { duration: motion.important, ...timing }),
      );
      presence.value = withTiming(settlePresence, {
        duration: motion.standard,
        ...timing,
      });
    };

    const extinguish = () => {
      pulse.value = withTiming(1, { duration: motion.fast, ...timing });
      presence.value = withTiming(settlePresence, {
        duration: motion.fast,
        ...timing,
      });
    };

    if (prev === null) {
      // Mount: optional one-shot only when animated and accents already present.
      if (animated && (hasActive || hasResolved)) {
        if (hasResolved) resolve();
        else ignite();
      } else {
        presence.value = settlePresence;
      }
      return;
    }

    if (prev === sig) return;

    if (!sig) {
      extinguish();
      return;
    }

    // Prefer resolve language when capacity just closed.
    if (hasResolved) resolve();
    else if (hasActive) ignite();
  }, [
    accentSig,
    animated,
    hasActiveAccent,
    hasResolvedAccent,
    settlePresence,
    presence,
    pulse,
  ]);

  const states = new Map(
    accents.map(({ index, state }) => [index, state]),
  );

  const baseWidth = compact ? 104 : 240;
  const baseHeight = compact ? 118 : 270;
  const baseNode = compact ? 7 : 11;
  const baseStemWidth = compact ? 7 : 11;
  const baseStemHeight = compact ? 26 : 52;

  const width = baseWidth * size;
  const height = baseHeight * size;
  const nodeSize = baseNode * size;
  const stemWidth = baseStemWidth * size;
  const stemHeight = baseStemHeight * size;
  const stemTop = compact ? '74%' : '76%';
  const foreground = tone === 'dark' ? colors.bone : colors.ink;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.mark,
        {
          width,
          height,
        },
      ]}
    >
      {NODES.map(([x, y], index) => {
        const weight = NODE_WEIGHT[index] ?? 1;
        return (
          <MarkNode
            key={index}
            x={x}
            y={y}
            size={nodeSize * weight}
            state={states.get(index) ?? 'default'}
            pulse={pulse}
            presence={presence}
            foreground={foreground}
            quietActive={activePresence === 'quiet'}
          />
        );
      })}

      <View
        style={[
          styles.stem,
          {
            left: '50%',
            top: stemTop,
            width: stemWidth,
            height: stemHeight,
            marginLeft: -stemWidth / 2,
            backgroundColor: foreground,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    position: 'relative',
  },

  node: {
    position: 'absolute',
    borderRadius: 999,
  },

  active: {
    backgroundColor: colors.signal,
  },

  activeQuiet: {
    // Base quiet read; live presence animated via SharedValue.
    opacity: 1,
  },

  open: {
    borderWidth: 1.5,
  },

  resolved: {
    borderWidth: 1.5,
  },

  activeCore: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.bone,
  },

  resolvedCore: {
    position: 'absolute',
    borderRadius: 999,
  },

  stem: {
    position: 'absolute',
    borderRadius: 5,
  },
});
