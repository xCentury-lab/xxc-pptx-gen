# xxc-pptx-gen

Generate professional PPTX presentations from any text/markdown file using PptxGenJS and react-icons.

## Usage

```
/xxc-pptx-gen /path/to/file.md
/xxc-pptx-gen /path/to/file.md --reflect
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| File path | Yes | Path to the source file (markdown, text, org-mode, etc.) |
| `--reflect` | No | Enable visual QA loop: converts slides to images, evaluates with Opus 4.6, fixes issues |

## Themes

The theme is auto-selected based on content analysis:

| Theme | Best For | Visual Style |
|-------|----------|-------------|
| **Dark** | Tech, strategy, analysis | Navy background, cyan/gold accents |
| **Light** | Education, reports, docs | White background, blue/orange accents |
| **Corporate** | Business, proposals | White + navy, gold accents |
| **Minimal** | Academic, simple notes | White + black, single red accent |

## Slide Types

| Type | Used For |
|------|----------|
| Title | Opening slide with title, subtitle, key formula |
| Section Header | Major section dividers |
| Bullet Points | Lists and enumerations |
| Metric Cards | Numeric data with descriptions |
| Comparison | Before/After, Pros/Cons |
| Flow Chart | Sequential processes |
| Table | Structured data |
| Chart | Bar/line/pie charts with numeric data |
| Action Items | Numbered recommendations |

## Architecture

```
~/.claude/skills/xxc-pptx-gen/
├── SKILL.md                    # Main skill definition
├── README.md                   # This file
└── assets/
    ├── themes.js               # 4 theme presets (Dark/Light/Corporate/Minimal)
    ├── components.js           # Reusable slide components (badges, cards, grids)
    ├── icon-helper.js          # react-icons SVG extraction (no React/ReactDOM needed)
    └── slide-templates.js      # 8 slide type templates
```

## Dependencies

Installed automatically if missing:
- `pptxgenjs` — PPTX generation engine
- `react-icons` — Icon library (SVG data extracted without React runtime)

## Reflection Mode

When `--reflect` is used:
1. PPTX is converted to PDF via LibreOffice headless
2. PDF pages are rendered to PNG via `pdftoppm`
3. Each slide image is evaluated by parallel agents for visual QA
4. Issues are fixed and slides regenerated until all pass
