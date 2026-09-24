/**
 * Broccoli Club type ladder — IBM Plex Sans / Mono only.
 * Named roles so screens stop inventing 52 / 59 / 62 / 68 / 88.
 * Larger clock figures: TIME role + a controlled size modifier.
 */
export const typography = {
  /** DISPLAY — Sans 700 · page openers */
  display: {
    fontFamily: 'IBMPlexSans_700Bold',
    fontSize: 52,
    lineHeight: 50,
    letterSpacing: -1.6,
  },
  /** HEADLINE — Sans 700 · section openers */
  headline: {
    fontFamily: 'IBMPlexSans_700Bold',
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  /** TITLE — Sans 700 · row / card titles */
  title: {
    fontFamily: 'IBMPlexSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  /** BODY — Sans 400 · reading copy */
  body: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  /** LABEL — Mono 600 · CTAs, structural chrome */
  label: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  /** META — Mono 400 · coordinates, dates, quiet indexes */
  meta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.25,
  },
  /** TIME — Mono 600 · editorial clock figures (base 64) */
  time: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 64,
    lineHeight: 60,
    letterSpacing: -2,
  },
} as const;
