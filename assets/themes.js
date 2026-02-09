// ============================================================================
// PPTX Theme Definitions
// 4 preset themes: Dark, Light, Corporate, Minimal
// ============================================================================

const themes = {
  // ---------------------------------------------------------------------------
  // DARK — Technical / Strategy / Analysis content
  // ---------------------------------------------------------------------------
  dark: {
    name: "Dark",
    colors: {
      background: "0D1B2A",
      surface:    "1B2838",
      surfaceAlt: "1E3A5F",
      text:       "FFFFFF",
      textMuted:  "E8ECF0",
      textFaint:  "8899AA",
      accent1:    "00A8E8",
      accent2:    "FFB800",
      accent3:    "38A169",
      semantic: {
        success: "38A169",
        warning: "DD6B20",
        error:   "E53E3E",
        info:    "00A8E8",
      },
      extra: {
        purple: "805AD5",
        teal:   "319795",
        orange: "DD6B20",
        red:    "E53E3E",
      },
    },
    fonts: {
      title: "Helvetica Neue",
      body:  "Helvetica Neue",
      mono:  "Courier New",
      cjk:   "Hiragino Sans",
    },
    layout: {
      margin:       0.4,
      gutter:       0.15,
      headerHeight: 0.5,
      footerY:      5.1,
      slideW:       10.0,
      slideH:       5.63,
    },
  },

  // ---------------------------------------------------------------------------
  // LIGHT — Education / Report content
  // ---------------------------------------------------------------------------
  light: {
    name: "Light",
    colors: {
      background: "FFFFFF",
      surface:    "F7FAFC",
      surfaceAlt: "EDF2F7",
      text:       "1A202C",
      textMuted:  "4A5568",
      textFaint:  "A0AEC0",
      accent1:    "3182CE",
      accent2:    "DD6B20",
      accent3:    "38A169",
      semantic: {
        success: "38A169",
        warning: "D69E2E",
        error:   "E53E3E",
        info:    "3182CE",
      },
      extra: {
        purple: "805AD5",
        teal:   "319795",
        orange: "DD6B20",
        red:    "E53E3E",
      },
    },
    fonts: {
      title: "Helvetica Neue",
      body:  "Helvetica Neue",
      mono:  "Courier New",
      cjk:   "Hiragino Sans",
    },
    layout: {
      margin:       0.5,
      gutter:       0.15,
      headerHeight: 0.5,
      footerY:      5.1,
      slideW:       10.0,
      slideH:       5.63,
    },
  },

  // ---------------------------------------------------------------------------
  // CORPORATE — Business / Proposal content
  // ---------------------------------------------------------------------------
  corporate: {
    name: "Corporate",
    colors: {
      background: "FFFFFF",
      surface:    "F8F9FA",
      surfaceAlt: "0D1B2A",
      text:       "1A202C",
      textMuted:  "4A5568",
      textFaint:  "A0AEC0",
      accent1:    "0D1B2A",
      accent2:    "C5960C",
      accent3:    "2B6CB0",
      semantic: {
        success: "276749",
        warning: "C5960C",
        error:   "C53030",
        info:    "2B6CB0",
      },
      extra: {
        purple: "553C9A",
        teal:   "285E61",
        orange: "C05621",
        red:    "C53030",
      },
    },
    fonts: {
      title: "Helvetica Neue",
      body:  "Helvetica Neue",
      mono:  "Courier New",
      cjk:   "Hiragino Sans",
    },
    layout: {
      margin:       0.5,
      gutter:       0.2,
      headerHeight: 0.5,
      footerY:      5.1,
      slideW:       10.0,
      slideH:       5.63,
    },
  },

  // ---------------------------------------------------------------------------
  // MINIMAL — Simple / Academic content
  // ---------------------------------------------------------------------------
  minimal: {
    name: "Minimal",
    colors: {
      background: "FFFFFF",
      surface:    "FAFAFA",
      surfaceAlt: "F0F0F0",
      text:       "111111",
      textMuted:  "555555",
      textFaint:  "999999",
      accent1:    "111111",
      accent2:    "E53E3E",
      accent3:    "555555",
      semantic: {
        success: "276749",
        warning: "975A16",
        error:   "9B2C2C",
        info:    "2A4365",
      },
      extra: {
        purple: "553C9A",
        teal:   "285E61",
        orange: "C05621",
        red:    "9B2C2C",
      },
    },
    fonts: {
      title: "Helvetica Neue",
      body:  "Helvetica Neue",
      mono:  "Courier New",
      cjk:   "Hiragino Sans",
    },
    layout: {
      margin:       0.6,
      gutter:       0.2,
      headerHeight: 0.5,
      footerY:      5.1,
      slideW:       10.0,
      slideH:       5.63,
    },
  },
};

/**
 * Get a flat color map (single-letter shorthand) from a theme.
 * Returns an object like { background, surface, text, accent, ... }
 * compatible with the generation scripts.
 */
function getFlatColors(theme) {
  const c = theme.colors;
  return {
    bg:        c.background,
    surface:   c.surface,
    surfaceAlt:c.surfaceAlt,
    text:      c.text,
    textMuted: c.textMuted,
    textFaint: c.textFaint,
    accent:    c.accent1,
    accent2:   c.accent2,
    accent3:   c.accent3,
    success:   c.semantic.success,
    warning:   c.semantic.warning,
    error:     c.semantic.error,
    info:      c.semantic.info,
    purple:    c.extra.purple,
    teal:      c.extra.teal,
    orange:    c.extra.orange,
    red:       c.extra.red,
  };
}

module.exports = { themes, getFlatColors };
