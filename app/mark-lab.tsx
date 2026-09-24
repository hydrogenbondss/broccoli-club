import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

type MarkState = 'default' | 'open' | 'active' | 'resolved';

const NODES = [
  [50, 4, 0], [40, 11, 0], [60, 11, 0],
  [28, 20, 0], [42, 20, 0], [55, 19, 0], [72, 22, 0],
  [18, 31, 0], [32, 30, 0], [47, 29, 0], [62, 30, 0], [79, 33, 0],
  [12, 42, 0], [25, 40, 0], [39, 41, 0], [54, 40, 0], [68, 41, 0], [85, 44, 0],
  [19, 52, 0], [33, 50, 0], [48, 51, 0], [63, 50, 0], [78, 53, 0],
  [29, 61, 0], [42, 60, 0], [56, 61, 0], [69, 62, 0],
  [40, 70, 0], [55, 70, 0], [60, 79, 1], [60, 89, 1],
] as const;

function MarkNode({
  x,
  y,
  state = 'default',
}: {
  x: number;
  y: number;
  state?: MarkState;
}) {
  return (
    <View
      style={[
        styles.node,
        {
          left: `${x}%`,
          top: `${y}%`,
        },
        state === 'open' && styles.nodeOpen,
        state === 'active' && styles.nodeActive,
        state === 'resolved' && styles.nodeResolved,
      ]}
    >
      {state === 'resolved' && <View style={styles.resolvedCore} />}
      {state === 'active' && <View style={styles.activeCore} />}
    </View>
  );
}

function BroccoliMark({
  accents = [],
  compact = false,
}: {
  accents?: { index: number; state: Exclude<MarkState, 'default'> }[];
  compact?: boolean;
}) {
  const states = new Map(accents.map(({ index, state }) => [index, state]));

  return (
    <View style={[styles.mark, compact && styles.markCompact]}>
      {NODES.map(([x, y, stem], index) =>
        stem ? (
          <View
            key={index}
            style={[
              styles.stemNode,
              {
                left: `${x}%`,
                top: `${y}%`,
              },
            ]}
          />
        ) : (
          <MarkNode
            key={index}
            x={x}
            y={y}
            state={states.get(index) ?? 'default'}
          />
        ),
      )}
    </View>
  );
}

function StateMark({ state }: { state: Exclude<MarkState, 'default'> }) {
  return (
    <View style={styles.stateFrame}>
      <MarkNode x={50} y={50} state={state} />
    </View>
  );
}

function ExampleRow({
  state,
  eyebrow,
  title,
  detail,
}: {
  state: Exclude<MarkState, 'default'>;
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <View style={styles.exampleRow}>
      <StateMark state={state} />
      <View style={styles.exampleCopy}>
        <Text variant="label" style={styles.eyebrow}>{eyebrow}</Text>
        <Text variant="title" style={styles.exampleTitle}>{title}</Text>
        <Text variant="body" muted style={styles.exampleDetail}>{detail}</Text>
      </View>
    </View>
  );
}

export default function MarkLabScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topline}>
          <Text variant="label">BROCCOLI CLUB / MARK LAB</Text>
          <Link href="/" style={styles.back}>BACK</Link>
        </View>

        <View style={styles.hero}>
          <Text variant="meta" muted>WORKING SYSTEM / 01</Text>
          <Text variant="display" style={styles.heroTitle}>One mark.{'\n'}Three states.</Text>
          <Text variant="body" muted style={styles.heroCopy}>
            The broccoli stays familiar. Only a few nodes change when something actually matters.
          </Text>
        </View>

        <View style={styles.markStage}>
          <BroccoliMark
            accents={[
              { index: 4, state: 'active' },
              { index: 10, state: 'open' },
              { index: 20, state: 'resolved' },
            ]}
          />
        </View>

        <View style={styles.rule} />

        <View style={styles.stateGrid}>
          <View style={styles.stateItem}>
            <StateMark state="open" />
            <Text variant="label" style={styles.stateName}>OPEN</Text>
            <Text variant="body" muted>Possibility / one place left</Text>
          </View>
          <View style={styles.stateItem}>
            <StateMark state="active" />
            <Text variant="label" style={styles.stateName}>ACTIVE</Text>
            <Text variant="body" muted>Joined / in motion</Text>
          </View>
          <View style={styles.stateItem}>
            <StateMark state="resolved" />
            <Text variant="label" style={styles.stateName}>RESOLVED</Text>
            <Text variant="body" muted>Played / finished</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="meta" muted>IN PRODUCT</Text>
          <Text variant="headline" style={styles.sectionTitle}>The meaning stays in the text.</Text>

          <View style={styles.exampleCard}>
            <ExampleRow
              state="open"
              eyebrow="GAME"
              title="One spot left"
              detail="Saturday · 4–6 PM · Victoria Park"
            />
            <View style={styles.exampleRule} />
            <ExampleRow
              state="active"
              eyebrow="YOU'RE IN"
              title="Saturday doubles"
              detail="3 players · Victoria Park"
            />
            <View style={styles.exampleRule} />
            <ExampleRow
              state="resolved"
              eyebrow="COMPLETED"
              title="Played with Maya"
              detail="Saturday · 4–6 PM"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="meta" muted>BRAND BEHAVIOUR</Text>
          <Text variant="headline" style={styles.sectionTitle}>Quiet until it matters.</Text>
          <Text variant="body" muted style={styles.bodyCopy}>
            Most of the mark remains ordinary. The rare changed node carries the character, while the surrounding interface stays instantly readable.
          </Text>
        </View>

        <View style={styles.miniMarkRow}>
          <BroccoliMark compact />
          <BroccoliMark
            compact
            accents={[
              { index: 8, state: 'active' },
              { index: 15, state: 'resolved' },
            ]}
          />
          <BroccoliMark
            compact
            accents={[
              { index: 3, state: 'open' },
              { index: 11, state: 'active' },
              { index: 23, state: 'resolved' },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  content: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.lg,
    paddingBottom: 110,
  },
  topline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    color: colors.ink,
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  hero: {
    marginTop: 46,
    maxWidth: 520,
  },
  heroTitle: {
    marginTop: 10,
  },
  heroCopy: {
    marginTop: 18,
    maxWidth: 390,
  },
  markStage: {
    marginTop: 38,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.concrete,
  },
  mark: {
    width: 240,
    height: 270,
    position: 'relative',
  },
  markCompact: {
    width: 106,
    height: 120,
  },
  node: {
    position: 'absolute',
    width: 11,
    height: 11,
    marginLeft: -5.5,
    marginTop: -5.5,
    borderRadius: 999,
    backgroundColor: colors.ink,
  },
  nodeOpen: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.broccoli,
  },
  nodeActive: {
    backgroundColor: colors.broccoli,
    transform: [{ scale: 1.18 }],
  },
  nodeResolved: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  activeCore: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bone,
    position: 'absolute',
    left: 4,
    top: 4,
  },
  resolvedCore: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.ink,
    position: 'absolute',
    left: 1.5,
    top: 1.5,
  },
  stemNode: {
    position: 'absolute',
    width: 11,
    height: 26,
    marginLeft: -5.5,
    marginTop: -4,
    borderRadius: 5,
    backgroundColor: colors.ink,
  },
  rule: {
    height: 1,
    backgroundColor: colors.concrete,
    marginTop: 42,
  },
  stateGrid: {
    marginTop: 24,
    gap: 18,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stateFrame: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.concrete,
  },
  stateName: {
    minWidth: 68,
    marginBottom: 3,
  },
  section: {
    marginTop: 50,
  },
  sectionTitle: {
    marginTop: 5,
    maxWidth: 480,
  },
  exampleCard: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.concrete,
    paddingHorizontal: 16,
  },
  exampleRow: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exampleCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.broccoli,
  },
  exampleTitle: {
    marginTop: 2,
  },
  exampleDetail: {
    marginTop: 2,
  },
  exampleRule: {
    height: 1,
    backgroundColor: colors.concrete,
  },
  bodyCopy: {
    marginTop: 12,
    maxWidth: 520,
  },
  miniMarkRow: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
