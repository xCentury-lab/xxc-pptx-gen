// ============================================================================
// react-icons SVG Extraction Helper
// Extracts SVG data URIs from react-icons GenIcon data without React/ReactDOM
// ============================================================================

/**
 * Convert a react-icons icon to a base64-encoded SVG data URI.
 *
 * @param {string} iconModule - The react-icons sub-package (e.g. "hi", "fi", "md")
 * @param {string} iconName   - The export name (e.g. "HiLightningBolt", "FiTarget")
 * @param {string} fillColor  - CSS color string including # (default "#FFFFFF")
 * @returns {string} Data URI string: "image/svg+xml;base64,..."
 */
function iconToSvgDataUri(iconModule, iconName, fillColor = "#FFFFFF") {
  const mod = require(`react-icons/${iconModule}`);
  const iconFn = mod[iconName];
  if (!iconFn) throw new Error(`Icon ${iconName} not found in react-icons/${iconModule}`);

  const src = iconFn.toString();
  const jsonMatch = src.match(/GenIcon\((\{.*?\})\)\(props\)/s);
  if (!jsonMatch) throw new Error(`Cannot parse icon ${iconName}`);

  const iconData = JSON.parse(jsonMatch[1]);
  const viewBox = iconData.attr.viewBox || "0 0 24 24";

  let paths = "";
  function renderChildren(children) {
    for (const child of children) {
      if (child.tag === "path") {
        const d = child.attr.d || "";
        const fillRule = child.attr.fillRule ? ` fill-rule="${child.attr.fillRule}"` : "";
        const clipRule = child.attr.clipRule ? ` clip-rule="${child.attr.clipRule}"` : "";
        paths += `<path d="${d}"${fillRule}${clipRule} fill="${fillColor}"/>`;
      } else if (child.tag === "circle") {
        const { cx, cy, r } = child.attr;
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}"/>`;
      } else if (child.tag === "rect") {
        const { x, y, width, height, rx } = child.attr;
        paths += `<rect x="${x||0}" y="${y||0}" width="${width}" height="${height}" rx="${rx||0}" fill="${fillColor}"/>`;
      } else if (child.tag === "line") {
        const { x1, y1, x2, y2 } = child.attr;
        paths += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fillColor}" stroke-width="2"/>`;
      } else if (child.tag === "polyline") {
        paths += `<polyline points="${child.attr.points}" fill="none" stroke="${fillColor}" stroke-width="2"/>`;
      } else if (child.tag === "polygon") {
        paths += `<polygon points="${child.attr.points}" fill="${fillColor}"/>`;
      }
      if (child.child && child.child.length > 0) renderChildren(child.child);
    }
  }
  renderChildren(iconData.child);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="64" height="64">${paths}</svg>`;
  const base64 = Buffer.from(svg).toString("base64");
  return `image/svg+xml;base64,${base64}`;
}

/**
 * Safely add an icon image to a slide, falling back to a colored circle on error.
 *
 * @param {object} pptx  - PptxGenJS instance (needed for ShapeType)
 * @param {object} slide  - The slide to add to
 * @param {string} iconModule - react-icons sub-package
 * @param {string} iconName   - Icon export name
 * @param {number} x - X position (inches)
 * @param {number} y - Y position (inches)
 * @param {number} size - Width & height (inches)
 * @param {string} color - Hex color without # (e.g. "00A8E8")
 */
function addIcon(pptx, slide, iconModule, iconName, x, y, size, color) {
  try {
    const data = iconToSvgDataUri(iconModule, iconName, `#${color}`);
    slide.addImage({ data, x, y, w: size, h: size });
  } catch (e) {
    slide.addShape(pptx.ShapeType.ellipse, {
      x, y, w: size, h: size, fill: { color },
    });
  }
}

module.exports = { iconToSvgDataUri, addIcon };
