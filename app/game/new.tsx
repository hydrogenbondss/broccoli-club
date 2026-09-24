import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Entrance } from '@/components/Entrance';
import { MotionPressable } from '@/components/MotionPressable';
import { Text } from '@/components/Text';
import { useGamesStore } from '@/context/GamesStore';
import { colors, spacing, typography } from '@/theme';

type FormState = {
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  court: string;
  format: string;
  level: string;
  maxPlayers: string;
  entryPrice: string;
};

const INITIAL: FormState = {
  venue: '',
  date: '',
  startTime: '',
  endTime: '',
  court: '',
  format: '',
  level: '',
  maxPlayers: '',
  entryPrice: '',
};

type FieldKey = keyof FormState;

type FieldDef = {
  key: FieldKey;
  label: string;
  placeholder: string;
  accessibilityLabel: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

type SectionDef = {
  id: string;
  title: string;
  fields: FieldDef[];
};

const SECTIONS: SectionDef[] = [
  {
    id: 'where',
    title: 'WHERE',
    fields: [
      {
        key: 'venue',
        label: 'Venue',
        placeholder: 'Victoria Park',
        accessibilityLabel: 'Venue',
        autoCapitalize: 'words',
      },
      {
        key: 'court',
        label: 'Court',
        placeholder: 'Court 03',
        accessibilityLabel: 'Court',
        autoCapitalize: 'words',
      },
    ],
  },
  {
    id: 'when',
    title: 'WHEN',
    fields: [
      {
        key: 'date',
        label: 'Date',
        placeholder: 'YYYY-MM-DD',
        accessibilityLabel: 'Date',
        autoCapitalize: 'none',
      },
      {
        key: 'startTime',
        label: 'Start',
        placeholder: 'HH:MM',
        accessibilityLabel: 'Start time',
        autoCapitalize: 'none',
      },
      {
        key: 'endTime',
        label: 'End',
        placeholder: 'HH:MM',
        accessibilityLabel: 'End time',
        autoCapitalize: 'none',
      },
    ],
  },
  {
    id: 'what',
    title: 'WHAT',
    fields: [
      {
        key: 'format',
        label: 'Format',
        placeholder: 'doubles',
        accessibilityLabel: 'Format',
        autoCapitalize: 'none',
      },
      {
        key: 'level',
        label: 'Level',
        placeholder: 'Intermediate',
        accessibilityLabel: 'Level',
        autoCapitalize: 'words',
      },
    ],
  },
  {
    id: 'field',
    title: 'FIELD',
    fields: [
      {
        key: 'maxPlayers',
        label: 'Max players',
        placeholder: '4',
        accessibilityLabel: 'Max players',
        keyboardType: 'number-pad',
      },
      {
        key: 'entryPrice',
        label: 'Entry',
        placeholder: '25',
        accessibilityLabel: 'Entry price',
        keyboardType: 'number-pad',
      },
    ],
  },
];

const ALL_FIELDS: FieldDef[] = SECTIONS.flatMap((s) => s.fields);

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{1,2}:\d{2}$/;

function isValidIsoDate(value: string): boolean {
  const trimmed = value.trim();
  if (!ISO_DATE.test(trimmed)) return false;
  const [y, m, d] = trimmed.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === (m ?? 1) - 1 &&
    dt.getDate() === d
  );
}

function isValidHhmm(value: string): boolean {
  const trimmed = value.trim();
  if (!HHMM.test(trimmed)) return false;
  const [hRaw, mRaw] = trimmed.split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function hhmmToMinutes(value: string): number {
  const [hRaw, mRaw] = value.trim().split(':');
  return Number(hRaw) * 60 + Number(mRaw);
}

export default function CreateGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createGame } = useGamesStore();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(() => {
    const next: Partial<Record<FieldKey, string>> = {};
    for (const field of ALL_FIELDS) {
      if (isBlank(form[field.key])) {
        next[field.key] = 'Required';
      }
    }

    if (!next.date && !isValidIsoDate(form.date)) {
      next.date = 'Use YYYY-MM-DD';
    }

    if (!next.startTime && !isValidHhmm(form.startTime)) {
      next.startTime = 'Use HH:MM';
    }

    if (!next.endTime && !isValidHhmm(form.endTime)) {
      next.endTime = 'Use HH:MM';
    }

    if (
      !next.startTime &&
      !next.endTime &&
      isValidHhmm(form.startTime) &&
      isValidHhmm(form.endTime) &&
      hhmmToMinutes(form.endTime) <= hhmmToMinutes(form.startTime)
    ) {
      next.endTime = 'Must be after start';
    }

    if (!next.maxPlayers) {
      const max = Number(form.maxPlayers);
      if (!Number.isFinite(max) || !Number.isInteger(max) || max < 2) {
        next.maxPlayers = 'At least 2';
      }
    }

    if (!next.entryPrice) {
      const price = Number(form.entryPrice);
      if (!Number.isFinite(price) || price < 0) {
        next.entryPrice = 'Must be 0 or more';
      }
    }

    return next;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    setAttempted(true);
    if (!isValid) return;

    const game = createGame({
      venue: form.venue.trim(),
      date: form.date.trim(),
      startTime: form.startTime.trim(),
      endTime: form.endTime.trim(),
      court: form.court.trim(),
      format: form.format.trim(),
      level: form.level.trim(),
      maxPlayers: Number(form.maxPlayers),
      entryPrice: Number(form.entryPrice),
    });

    router.replace({ pathname: '/game/[id]', params: { id: game.id } });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            { paddingBottom: spacing.section + insets.bottom },
          ]}
        >
          <View style={styles.header}>
            <MotionPressable
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace('/');
              }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.backHit, pressed && styles.pressed]}
            >
              <Text variant="label">← Back</Text>
            </MotionPressable>
            <Text variant="meta" muted>New fixture</Text>
          </View>

          <Entrance>
            <Text variant="meta" muted>Have a court?</Text>
            <Text variant="headline" style={styles.title}>Bring the club in.</Text>
            <Text variant="body" muted style={styles.subtitle}>
              Open a local game. No invites, no payments — just the field.
            </Text>

            {SECTIONS.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text variant="meta" muted style={styles.sectionTitle}>
                  {section.title}
                </Text>
                <View style={styles.sectionRule} />
                {section.fields.map((field, index) => {
                  const showError = attempted && errors[field.key];
                  const isLast = index === section.fields.length - 1;
                  return (
                    <View
                      key={field.key}
                      style={[styles.fieldRow, isLast && styles.fieldRowLast]}
                    >
                      <Text variant="meta" muted style={styles.fieldLabel}>
                        {field.label}
                      </Text>
                      <TextInput
                        value={form[field.key]}
                        onChangeText={(value) => setField(field.key, value)}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.muted}
                        keyboardType={field.keyboardType ?? 'default'}
                        autoCapitalize={field.autoCapitalize ?? 'sentences'}
                        autoCorrect={false}
                        accessibilityLabel={field.accessibilityLabel}
                        accessibilityHint={showError ? errors[field.key] : undefined}
                        style={styles.input}
                      />
                      {showError ? (
                        <Text variant="meta" style={styles.errorText}>
                          {errors[field.key]}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            ))}

            <MotionPressable
              haptic="medium"
              onPress={onSubmit}
              accessibilityRole="button"
              accessibilityLabel="Create game"
              accessibilityHint={attempted && !isValid ? 'Form has invalid fields' : 'Creates the game and opens it'}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.pressed,
                attempted && !isValid && styles.ctaDisabled,
              ]}
            >
              <Text variant="label" style={styles.ctaText}>CREATE GAME</Text>
            </MotionPressable>
          </Entrance>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.page, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backHit: { minHeight: 44, justifyContent: 'center' },
  title: { marginTop: 4 },
  subtitle: { marginTop: 6, marginBottom: 8 },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    letterSpacing: 0.6,
  },
  sectionRule: {
    marginTop: 8,
    marginBottom: 2,
    height: 1,
    backgroundColor: colors.ink,
  },
  fieldRow: {
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.concrete,
  },
  fieldRowLast: {},
  fieldLabel: { marginBottom: 8 },
  input: {
    minHeight: 28,
    padding: 0,
    margin: 0,
    color: colors.ink,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontFamily: typography.body.fontFamily,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  errorText: { color: colors.muted, marginTop: 6 },
  cta: {
    marginTop: 36,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: colors.bone },
  pressed: { opacity: 0.68 },
});
