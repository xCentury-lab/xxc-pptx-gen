---
name: xxc-pptx-gen
description: Generates professional PPTX presentations from any text/markdown file using PptxGenJS and react-icons. Supports auto-theme detection and optional Opus 4.6 visual QA reflection.
user_invocable: true
---

# PPTX Generation Skill

Generate professional, visually polished PPTX presentations from any text or markdown file using PptxGenJS and react-icons.

## Input Parsing

The user invokes this skill with:
```
/xxc-pptx-gen /path/to/file.md [--reflect]
```

Parse the arguments:
1. **File path**: The first argument (required). This is the source file to convert into a presentation.
2. **--reflect flag**: Optional. When present, enables the visual QA reflection loop after generation.

## Execution Steps

### Step 1: Read & Analyze the Source File

Use the `Read` tool to load the input file. Analyze its structure:
- Count headings (H1, H2, H3) — these become slide boundaries
- Identify bullet lists — become bullet slides
- Find numeric data / metrics — become metric card slides
- Detect comparisons (before/after, pros/cons) — become comparison slides
- Identify sequences / processes — become flow chart slides
- Find tables — become table slides
- Detect action items / recommendations — become action slides
- Identify quotes or callouts — become quote slides

### Step 2: Auto-Select Theme

Based on the content's tone and domain, select one of 4 themes from `assets/themes.js`:

| Theme | When to Use | Signal Keywords |
|-------|------------|-----------------|
| **Dark** | Technical, strategy, analysis, security, engineering | architecture, system, API, infrastructure, strategy, analysis, AI, ML |
| **Light** | Education, tutorials, reports, documentation | learn, guide, tutorial, report, research, study, review |
| **Corporate** | Business proposals, quarterly reviews, executive briefings | revenue, growth, Q1-Q4, ROI, stakeholder, proposal, business |
| **Minimal** | Academic papers, simple notes, clean presentations | abstract, methodology, hypothesis, theorem, simple, clean |

If ambiguous, default to **Dark** for technical content or **Light** for general content.

### Step 3: Design Slide Deck Structure

Map content to slides following this pattern:
1. **Title Slide** (always first): Extract the main title, subtitle, and any key formula/thesis
2. **Section Slides**: One per major heading (H1/H2)
3. **Content Slides**: Map subsections to appropriate slide types
4. **Summary/Action Slide** (always last): Key takeaways or action items

**Slide count guideline**: `number_of_H2_headings + 2` (title + closing) as baseline. Add more for data-heavy sections.

### Step 4: Generate the Node.js Script

Create a Node.js script that:
1. Requires `pptxgenjs` and the assets from `~/.claude/skills/xxc-pptx-gen/assets/`:

```javascript
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const { themes, getFlatColors } = require(path.join(process.env.HOME, ".claude/skills/xxc-pptx-gen/assets/themes"));
const { iconToSvgDataUri, addIcon } = require(path.join(process.env.HOME, ".claude/skills/xxc-pptx-gen/assets/icon-helper"));
const { addBadge, addMetricCard, addQuadrant, addCardGrid, addComparisonPanel, addFlowChart, addSlideFooter } = require(path.join(process.env.HOME, ".claude/skills/xxc-pptx-gen/assets/components"));
const { titleSlide, sectionSlide, bulletSlide, metricGridSlide, comparisonSlide, chartSlide, tableSlide, actionSlide } = require(path.join(process.env.HOME, ".claude/skills/xxc-pptx-gen/assets/slide-templates"));
```

2. Uses the selected theme
3. Builds each slide using the template functions OR custom inline code for complex/unique layouts
4. Writes the .pptx file

**Important design principles**:
- Use `react-icons/hi` (Heroicons) as the primary icon set — they are clean and professional
- Choose semantically appropriate icons for each section
- Use the theme's color palette consistently — accent1 for primary elements, accent2 for highlights, accent3 for secondary
- Every slide gets a footer via `addSlideFooter()`
- Use shadows sparingly for emphasis (key formula boxes, "after" panels)
- Keep font sizes readable: titles 14-18pt, body 9-11pt, metrics 22-28pt
- For mixed-language content (CJK + Latin), the font stack handles fallback automatically

### Step 5: Check Dependencies

Before running the script, verify that `pptxgenjs` and `react-icons` are available:

```bash
node -e "require('pptxgenjs'); require('react-icons/hi')" 2>/dev/null || npm install pptxgenjs react-icons
```

Run this check in the directory where the script will execute.

### Step 6: Execute & Generate PPTX

Run the generated script with Node.js. The output file should be named based on the input file:
- Input: `/path/to/my-report.md` → Output: `/path/to/my-report.pptx`
- The PPTX is saved in the same directory as the input file

### Step 7: Reflection (--reflect only)

If the `--reflect` flag was provided, perform visual QA:

1. **Convert to images**: Use LibreOffice to convert PPTX → PDF, then `pdftoppm` to convert each page to PNG:
```bash
libreoffice --headless --convert-to pdf --outdir /tmp/pptx-qa "$OUTPUT_PATH"
pdftoppm -png -r 200 "/tmp/pptx-qa/$(basename "$OUTPUT_PATH" .pptx).pdf" /tmp/pptx-qa/slide
```

2. **Visual QA**: Launch parallel Task agents (one per slide image) to evaluate:
   - Text readability (contrast, size, overflow)
   - Layout balance and alignment
   - Color consistency with theme
   - Information density (not too crowded, not too sparse)
   - Icon appropriateness

3. **Fix & Regenerate**: If issues are found, modify the generation script and re-run. Repeat until all slides pass QA.

4. **Clean up**: Remove temporary PDF/PNG files after QA completes.

## Icon Selection Guide

When choosing icons from `react-icons/hi`, match semantics:

| Concept | Icon |
|---------|------|
| Lightning/Energy/Speed | HiLightningBolt |
| Star/Quality/Premium | HiSparkles, HiStar |
| Chart/Analytics | HiChartBar, HiTrendingUp |
| Settings/Config | HiCog, HiAdjustments |
| Users/Team | HiUserGroup, HiUsers |
| Check/Success | HiCheckCircle, HiBadgeCheck |
| Warning/Error | HiExclamation, HiXCircle |
| Link/Connection | HiLink, HiGlobeAlt |
| Shield/Security | HiShieldCheck, HiShieldExclamation |
| Document/Report | HiDocumentText, HiClipboardList |
| Code/Tech | HiCode, HiChip, HiTerminal |
| Target/Goal | HiCursorClick |
| Eye/Vision | HiEye, HiEyeOff |
| Heart/Health | HiHeart |
| Play/Action | HiPlay |
| Question | HiQuestionMarkCircle |
| Cube/Model | HiCube |
| Beaker/Experiment | HiBeaker |
| Globe/World | HiGlobe, HiGlobeAlt |

## Output

After successful generation, report:
1. The output file path
2. Number of slides generated
3. Theme used
4. Slide breakdown (type and title of each slide)
