// ============================================================================
// Reusable Slide Components for PptxGenJS
// ============================================================================

const { addIcon } = require("./icon-helper");

/**
 * Add a colored badge (rounded rectangle with centered text).
 */
function addBadge(pptx, slide, text, x, y, w, h, bgColor, textColor, theme) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: bgColor },
    rectRadius: 0.08,
  });
  slide.addText(text, {
    x, y, w, h,
    fontSize: 11, bold: true, color: textColor,
    align: "center", valign: "middle",
    fontFace: theme.fonts.title,
  });
}

/**
 * Add a metric card with large number + description.
 */
function addMetricCard(pptx, slide, metric, desc, x, y, w, h, accentColor, theme) {
  const c = theme.colors;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: c.surface },
    line: { color: accentColor, width: 1 },
    rectRadius: 0.06,
  });
  slide.addText(metric, {
    x, y: y + 0.1, w, h: h * 0.4,
    fontSize: 24, bold: true, color: accentColor,
    align: "center", valign: "middle",
    fontFace: theme.fonts.title,
  });
  // Separator line
  slide.addShape(pptx.ShapeType.rect, {
    x: x + w * 0.12, y: y + h * 0.45,
    w: w * 0.76, h: 0.02,
    fill: { color: accentColor, transparency: 50 },
  });
  slide.addText(desc, {
    x: x + 0.1, y: y + h * 0.5, w: w - 0.2, h: h * 0.45,
    fontSize: 8.5, color: c.textMuted,
    align: "center", fontFace: theme.fonts.body,
    lineSpacingMultiple: 1.4,
  });
}

/**
 * Add a 4-quadrant layout (2x2 grid of content panels).
 * items: [{ title, icon, iconModule, color, text }]
 */
function addQuadrant(pptx, slide, items, theme) {
  const c = theme.colors;
  const m = theme.layout.margin;
  const positions = [
    { x: m, y: 0.85, w: 4.4, h: 1.8 },
    { x: 5.2, y: 0.85, w: 4.4, h: 1.8 },
    { x: m, y: 2.85, w: 4.4, h: 1.8 },
    { x: 5.2, y: 2.85, w: 4.4, h: 1.8 },
  ];

  items.forEach((item, i) => {
    if (i >= 4) return;
    const pos = positions[i];
    slide.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      fill: { color: c.surface },
      line: { color: item.color, width: 1 },
      rectRadius: 0.06,
    });
    if (item.icon) {
      addIcon(pptx, slide, item.iconModule || "hi", item.icon, pos.x + 0.15, pos.y + 0.12, 0.25, item.color);
    }
    slide.addText(item.title, {
      x: pos.x + (item.icon ? 0.45 : 0.15), y: pos.y + 0.1,
      w: pos.w - 0.6, h: 0.3,
      fontSize: 12, bold: true, color: item.color,
      fontFace: theme.fonts.title,
    });
    slide.addText(item.text, {
      x: pos.x + 0.15, y: pos.y + 0.5,
      w: pos.w - 0.3, h: pos.h - 0.65,
      fontSize: 9, color: c.textMuted,
      fontFace: theme.fonts.body,
      lineSpacingMultiple: 1.4, valign: "top",
    });
  });
}

/**
 * Add a card grid layout (N columns).
 * items: [{ title, desc, color, icon?, iconModule? }]
 */
function addCardGrid(pptx, slide, items, cols, yStart, theme) {
  const c = theme.colors;
  const m = theme.layout.margin;
  const totalW = theme.layout.slideW - m * 2;
  const gap = theme.layout.gutter;
  const cardW = (totalW - gap * (cols - 1)) / cols;
  const cardH = 1.5;

  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = m + col * (cardW + gap);
    const y = yStart + row * (cardH + gap);

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: cardW, h: cardH,
      fill: { color: c.surface },
      line: { color: item.color, width: 1 },
      rectRadius: 0.06,
    });
    if (item.icon) {
      addIcon(pptx, slide, item.iconModule || "hi", item.icon, x + 0.15, y + 0.12, 0.3, item.color);
    }
    slide.addText(item.title, {
      x: x + (item.icon ? 0.5 : 0.15), y: y + 0.1,
      w: cardW - 0.6, h: 0.3,
      fontSize: 13, bold: true, color: item.color,
      fontFace: theme.fonts.title,
    });
    slide.addText(item.desc, {
      x: x + 0.15, y: y + 0.5,
      w: cardW - 0.3, h: cardH - 0.65,
      fontSize: 9, color: c.textMuted,
      fontFace: theme.fonts.body,
      lineSpacingMultiple: 1.3,
    });
  });
}

/**
 * Add a Before/After comparison panel.
 * before: { label, items: [{ text, icon? }] }
 * after:  { label, items: [{ text, icon? }] }
 */
function addComparisonPanel(pptx, slide, before, after, yStart, theme) {
  const c = theme.colors;
  const panelW = 3.8;
  const panelH = 3.2;

  // Before box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: yStart, w: panelW, h: panelH,
    fill: { color: c.surface },
    line: { color: c.textFaint, width: 1.5 },
    rectRadius: 0.08,
  });
  slide.addText(before.label || "BEFORE", {
    x: 0.6, y: yStart, w: panelW, h: 0.45,
    fontSize: 14, bold: true, color: c.textFaint,
    align: "center", fontFace: theme.fonts.title,
  });
  (before.items || []).forEach((item, i) => {
    if (item.icon) {
      addIcon(pptx, slide, item.iconModule || "hi", item.icon, 1.0, yStart + 0.7 + i * 0.7, 0.22, c.extra.red);
    }
    slide.addText(item.text, {
      x: item.icon ? 1.3 : 1.0, y: yStart + 0.7 + i * 0.7,
      w: 2.8, h: 0.3,
      fontSize: 12, color: c.textMuted,
      fontFace: theme.fonts.body, valign: "middle",
    });
  });

  // Arrow
  slide.addShape(pptx.ShapeType.rightArrow, {
    x: 4.55, y: yStart + panelH / 2 - 0.3, w: 0.9, h: 0.6,
    fill: { color: c.accent2 },
  });

  // After box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.6, y: yStart, w: panelW, h: panelH,
    fill: { color: c.surfaceAlt },
    line: { color: c.accent1, width: 2 },
    rectRadius: 0.08,
    shadow: { type: "outer", blur: 12, offset: 4, color: "000000", opacity: 0.3 },
  });
  slide.addText(after.label || "AFTER", {
    x: 5.6, y: yStart, w: panelW, h: 0.45,
    fontSize: 14, bold: true, color: c.accent1,
    align: "center", fontFace: theme.fonts.title,
  });
  (after.items || []).forEach((item, i) => {
    if (item.icon) {
      addIcon(pptx, slide, item.iconModule || "hi", item.icon, 6.0, yStart + 0.7 + i * 0.7, 0.22, c.semantic.success);
    }
    slide.addText(item.text, {
      x: item.icon ? 6.3 : 6.0, y: yStart + 0.7 + i * 0.7,
      w: 2.8, h: 0.3,
      fontSize: 12, color: c.text, bold: true,
      fontFace: theme.fonts.body, valign: "middle",
    });
  });
}

/**
 * Add a simple flow chart (horizontal sequence of nodes with arrows).
 * nodes: [{ label, color }]
 */
function addFlowChart(pptx, slide, nodes, yStart, theme) {
  const c = theme.colors;
  const m = theme.layout.margin;
  const totalW = theme.layout.slideW - m * 2;
  const nodeW = Math.min(2.0, (totalW - (nodes.length - 1) * 0.8) / nodes.length);
  const nodeH = 0.6;
  const gap = (totalW - nodeW * nodes.length) / (nodes.length - 1 || 1);

  nodes.forEach((node, i) => {
    const x = m + i * (nodeW + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: yStart, w: nodeW, h: nodeH,
      fill: { color: node.color || c.accent1 },
      rectRadius: 0.06,
      shadow: { type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.3 },
    });
    slide.addText(node.label, {
      x, y: yStart, w: nodeW, h: nodeH,
      fontSize: 10, bold: true, color: c.background,
      align: "center", valign: "middle",
      fontFace: theme.fonts.title,
    });

    // Arrow between nodes
    if (i < nodes.length - 1) {
      const arrowX = x + nodeW;
      const arrowW = gap;
      if (arrowW > 0.2) {
        slide.addShape(pptx.ShapeType.rightArrow, {
          x: arrowX + arrowW * 0.15, y: yStart + nodeH * 0.2,
          w: arrowW * 0.7, h: nodeH * 0.6,
          fill: { color: c.textFaint },
        });
      }
    }
  });
}

/**
 * Add a slide footer with brand text and page number.
 */
function addSlideFooter(pptx, slide, num, total, brandText, theme) {
  const c = theme.colors;
  // Separator line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: theme.layout.footerY, w: theme.layout.slideW, h: 0.02,
    fill: { color: c.accent1, transparency: 60 },
  });
  // Brand text
  slide.addText(brandText || "PPTX-GEN", {
    x: 0.4, y: theme.layout.footerY + 0.1, w: 3.0, h: 0.3,
    fontSize: 7, color: c.textFaint,
    fontFace: theme.fonts.body, letterSpacing: 2,
  });
  // Page number
  slide.addText(`${num} / ${total}`, {
    x: 9.0, y: theme.layout.footerY + 0.1, w: 1.0, h: 0.3,
    fontSize: 8, color: c.textFaint, align: "right",
    fontFace: theme.fonts.body,
  });
}

module.exports = {
  addBadge,
  addMetricCard,
  addQuadrant,
  addCardGrid,
  addComparisonPanel,
  addFlowChart,
  addSlideFooter,
};
