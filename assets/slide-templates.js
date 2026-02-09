// ============================================================================
// Slide Templates for PptxGenJS
// Each function creates a fully-formed slide of a specific type.
// ============================================================================

const { addIcon } = require("./icon-helper");
const {
  addBadge,
  addMetricCard,
  addQuadrant,
  addCardGrid,
  addComparisonPanel,
  addFlowChart,
  addSlideFooter,
} = require("./components");

/**
 * Title Slide
 * data: { title, subtitle, formula?, source?, badge?, icon? }
 */
function titleSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10.0, h: 0.06,
    fill: { color: c.accent1 },
  });

  // Badge
  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.5, 0.5, 1.8, 0.45, c.accent1, c.background, theme);
  }

  // Icon
  if (data.icon) {
    addIcon(pptx, slide, data.icon.module || "hi", data.icon.name, 0.5, 1.5, 0.6, c.accent2);
  }

  // Title
  slide.addText(data.title, {
    x: 0.5, y: data.icon ? 2.0 : 1.5, w: 9.0, h: 0.8,
    fontSize: 36, bold: true, color: c.text,
    fontFace: theme.fonts.title,
  });

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5, y: data.icon ? 2.7 : 2.3, w: 9.0, h: 0.6,
      fontSize: 22, color: c.accent1,
      fontFace: theme.fonts.title,
    });
  }

  // Wisdom formula box
  if (data.formula) {
    const formulaY = data.icon ? 3.6 : 3.2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: formulaY, w: 9.0, h: 0.7,
      fill: { color: c.surfaceAlt },
      line: { color: c.accent1, width: 1.5 },
      rectRadius: 0.05,
    });
    slide.addText(data.formula, {
      x: 0.5, y: formulaY, w: 9.0, h: 0.7,
      fontSize: 18, color: c.accent2, align: "center", valign: "middle",
      fontFace: theme.fonts.mono, bold: true,
    });
  }

  // Source line
  if (data.source) {
    slide.addText(data.source, {
      x: 0.5, y: 4.6, w: 9.0, h: 0.3,
      fontSize: 9, color: c.textFaint, fontFace: theme.fonts.body,
    });
  }

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Section Header Slide
 * data: { badge, title, subtitle?, icon? }
 */
function sectionSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  // Badge
  addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent1, data.badgeTextColor || c.background, theme);

  // Icon
  if (data.icon) {
    addIcon(pptx, slide, data.icon.module || "hi", data.icon.name, 0.4, 0.85, 0.35, c.accent2);
  }

  // Title
  slide.addText(data.title, {
    x: data.icon ? 0.85 : 0.4, y: 0.85, w: 6.0, h: 0.4,
    fontSize: 18, bold: true, color: c.accent2,
    fontFace: theme.fonts.title,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.4, y: 1.4, w: 9.2, h: 0.4,
      fontSize: 12, color: c.textMuted,
      fontFace: theme.fonts.body,
    });
  }

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Bullet Points Slide
 * data: { badge, title, items: [{ text, bold? }], icon? }
 */
function bulletSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  // Badge
  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent1, data.badgeTextColor || c.background, theme);
  }

  // Title
  if (data.title) {
    slide.addText(data.title, {
      x: 0.4, y: 0.8, w: 9.2, h: 0.4,
      fontSize: 16, bold: true, color: c.text,
      fontFace: theme.fonts.title,
    });
  }

  // Bullet items
  const startY = data.title ? 1.4 : 0.8;
  const items = data.items || [];
  items.forEach((item, i) => {
    const y = startY + i * 0.45;
    if (y > 4.8) return; // Prevent overflow

    const bulletColor = item.color || c.accent1;
    // Bullet dot
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: y + 0.1, w: 0.12, h: 0.12,
      fill: { color: bulletColor },
    });
    slide.addText(item.text, {
      x: 0.8, y, w: 8.6, h: 0.4,
      fontSize: 12, color: item.bold ? c.text : c.textMuted,
      bold: !!item.bold,
      fontFace: theme.fonts.body, valign: "middle",
    });
  });

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Metric Grid Slide
 * data: { badge, metrics: [{ value, desc, color }] }
 */
function metricGridSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent1, data.badgeTextColor || c.background, theme);
  }

  if (data.title) {
    slide.addText(data.title, {
      x: 0.4, y: 0.8, w: 9.2, h: 0.35,
      fontSize: 14, bold: true, color: c.text,
      fontFace: theme.fonts.title,
    });
  }

  const metrics = data.metrics || [];
  const cols = Math.min(metrics.length, 5);
  const m = theme.layout.margin;
  const gap = theme.layout.gutter;
  const totalW = theme.layout.slideW - m * 2;
  const cardW = (totalW - gap * (cols - 1)) / cols;
  const startY = data.title ? 1.3 : 0.9;
  const cardH = 2.7;

  metrics.forEach((metric, i) => {
    const x = m + i * (cardW + gap);
    addMetricCard(pptx, slide, metric.value, metric.desc, x, startY, cardW, cardH, metric.color || c.accent1, theme);
  });

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Comparison Slide (Before/After)
 * data: { badge, title?, before: { label, items }, after: { label, items }, summary? }
 */
function comparisonSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent2, data.badgeTextColor || c.background, theme);
  }

  addComparisonPanel(pptx, slide, data.before, data.after, 1.0, theme);

  if (data.summary) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 4.4, w: 8.0, h: 0.5,
      fill: { color: c.surfaceAlt },
      line: { color: c.accent2, width: 1 },
      rectRadius: 0.05,
    });
    slide.addText(data.summary, {
      x: 1.0, y: 4.4, w: 8.0, h: 0.5,
      fontSize: 11, color: c.accent2, italic: true,
      align: "center", valign: "middle",
      fontFace: theme.fonts.body,
    });
  }

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Chart Slide (bar/line/pie via PptxGenJS chart API)
 * data: { badge, title, chartType, chartData, chartOpts?, tableData? }
 */
function chartSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent1, data.badgeTextColor || c.background, theme);
  }

  if (data.title) {
    slide.addText(data.title, {
      x: 0.4, y: 0.8, w: 5.0, h: 0.3,
      fontSize: 12, bold: true, color: c.text,
      fontFace: theme.fonts.title,
    });
  }

  // Chart
  const chartType = data.chartType || pptx.ChartType.bar;
  const defaultChartOpts = {
    x: 0.4, y: 1.2, w: data.tableData ? 4.8 : 9.2, h: 3.5,
    showTitle: false,
    showValue: true,
    valueFontSize: 9,
    catAxisLabelColor: c.textMuted,
    valAxisLabelColor: c.textMuted,
    catAxisLabelFontSize: 9,
    valAxisLabelFontSize: 8,
    chartColors: [c.accent1, c.accent2, c.accent3],
    plotArea: { fill: { color: c.surface } },
    catAxisLineShow: false,
    valAxisLineShow: false,
    valAxisMajorGridColor: c.surfaceAlt,
    dataLabelColor: c.text,
    catAxisLabelFontFace: theme.fonts.body,
    valAxisLabelFontFace: theme.fonts.body,
    dataLabelFontFace: theme.fonts.body,
  };
  slide.addChart(chartType, data.chartData, { ...defaultChartOpts, ...(data.chartOpts || {}) });

  // Optional side table
  if (data.tableData) {
    slide.addTable(data.tableData.rows, {
      x: 5.5, y: 1.2, w: 4.2,
      colW: data.tableData.colW,
      rowH: 0.35,
      border: { type: "solid", pt: 0.5, color: c.surfaceAlt },
      fill: { color: c.surface },
      margin: [3, 5, 3, 5],
    });
  }

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Table Slide
 * data: { badge, title, rows, colW? }
 */
function tableSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.accent1, data.badgeTextColor || c.background, theme);
  }

  if (data.title) {
    slide.addText(data.title, {
      x: 0.4, y: 0.8, w: 9.2, h: 0.35,
      fontSize: 14, bold: true, color: c.text,
      fontFace: theme.fonts.title,
    });
  }

  slide.addTable(data.rows, {
    x: 0.4, y: data.title ? 1.3 : 0.8,
    w: 9.2,
    colW: data.colW,
    rowH: 0.4,
    border: { type: "solid", pt: 0.5, color: c.surfaceAlt },
    fill: { color: c.surface },
    margin: [4, 6, 4, 6],
    autoPage: true,
    autoPageRepeatHeader: true,
  });

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

/**
 * Action Items Slide
 * data: { badge, actions: [{ num, title, desc, icon?, color }] }
 */
function actionSlide(pptx, slide, data, num, total, theme) {
  const c = theme.colors;
  slide.background = { color: c.background };

  if (data.badge) {
    addBadge(pptx, slide, data.badge, 0.3, 0.25, Math.max(2.0, data.badge.length * 0.15 + 0.8), 0.4, data.badgeColor || c.extra.red, data.badgeTextColor || c.text, theme);
  }

  const actions = data.actions || [];
  actions.forEach((action, i) => {
    if (i >= 4) return;
    const yPos = 0.9 + i * 1.1;

    // Number badge (circle)
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: yPos + 0.1, w: 0.55, h: 0.55,
      fill: { color: action.color || c.accent1 },
    });
    slide.addText(action.num || String(i + 1).padStart(2, "0"), {
      x: 0.5, y: yPos + 0.1, w: 0.55, h: 0.55,
      fontSize: 16, bold: true, color: c.background,
      align: "center", valign: "middle",
      fontFace: theme.fonts.title,
    });

    // Content card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.3, y: yPos, w: 8.3, h: 0.9,
      fill: { color: c.surface },
      line: { color: action.color || c.accent1, width: 1 },
      rectRadius: 0.06,
    });
    if (action.icon) {
      addIcon(pptx, slide, action.iconModule || "hi", action.icon, 1.5, yPos + 0.08, 0.28, action.color || c.accent1);
    }
    slide.addText(action.title, {
      x: action.icon ? 1.85 : 1.5, y: yPos + 0.05,
      w: 5.0, h: 0.3,
      fontSize: 13, bold: true, color: action.color || c.accent1,
      fontFace: theme.fonts.title,
    });
    slide.addText(action.desc, {
      x: 1.5, y: yPos + 0.4, w: 7.9, h: 0.45,
      fontSize: 9.5, color: c.textMuted,
      fontFace: theme.fonts.body,
      lineSpacingMultiple: 1.4, valign: "top",
    });
  });

  addSlideFooter(pptx, slide, num, total, data.brand, theme);
}

module.exports = {
  titleSlide,
  sectionSlide,
  bulletSlide,
  metricGridSlide,
  comparisonSlide,
  chartSlide,
  tableSlide,
  actionSlide,
};
