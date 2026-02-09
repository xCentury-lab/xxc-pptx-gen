# xxc-pptx-gen

使用 PptxGenJS 和 react-icons，将任意文本/Markdown 文件生成为专业的 PPTX 演示文稿。

## 使用方法

```
/xxc-pptx-gen /path/to/file.md
/xxc-pptx-gen /path/to/file.md --reflect
```

### 参数

| 参数 | 必须 | 说明 |
|------|------|------|
| 文件路径 | 是 | 源文件路径（支持 Markdown、纯文本、org-mode 等） |
| `--reflect` | 否 | 启用视觉QA循环：将幻灯片转为图片，由 Opus 4.6 评估并修复问题 |

## 主题

根据内容分析自动选择主题：

| 主题 | 适用场景 | 视觉风格 |
|------|----------|----------|
| **Dark** | 技术、战略、分析 | 深蓝背景，青色/金色强调 |
| **Light** | 教育、报告、文档 | 白色背景，蓝色/橙色强调 |
| **Corporate** | 商务、提案 | 白色+深蓝，金色强调 |
| **Minimal** | 学术、简洁笔记 | 白色+黑色，单一红色强调 |

## 幻灯片类型

| 类型 | 用途 |
|------|------|
| Title（标题页） | 开场幻灯片，含标题、副标题、核心公式 |
| Section Header（章节页） | 主要章节分隔 |
| Bullet Points（要点页） | 列表与枚举 |
| Metric Cards（指标卡片） | 数值数据及说明 |
| Comparison（对比页） | Before/After、优缺点对比 |
| Flow Chart（流程图） | 顺序流程 |
| Table（表格页） | 结构化数据 |
| Chart（图表页） | 柱状图/折线图/饼图等数值图表 |
| Action Items（行动项） | 编号建议/行动方案 |

## 架构

```
~/.claude/skills/xxc-pptx-gen/
├── SKILL.md                    # 主技能定义
├── README.md                   # 英文文档
├── README_CN.md                # 本文件（中文文档）
└── assets/
    ├── themes.js               # 4套主题预设（Dark/Light/Corporate/Minimal）
    ├── components.js           # 可复用幻灯片组件（徽章、卡片、网格等）
    ├── icon-helper.js          # react-icons SVG 提取（无需 React/ReactDOM 运行时）
    └── slide-templates.js      # 8种幻灯片模板
```

## 依赖

缺失时自动安装：
- `pptxgenjs` — PPTX 生成引擎
- `react-icons` — 图标库（直接提取 SVG 数据，无需 React 运行时）

## 反思模式（Reflection）

使用 `--reflect` 时：
1. 通过 LibreOffice headless 将 PPTX 转为 PDF
2. 通过 `pdftoppm` 将 PDF 各页渲染为 PNG
3. 在主上下文中直接使用 `Read` 工具逐张查看幻灯片图片进行视觉QA（每批6张并行读取）。**注意：不使用后台 Task 代理**——后台代理无法继承交互式文件读取权限，会导致 "auto-denied" 错误
4. 对未通过的幻灯片修复并重新生成，直至全部通过
5. 清理临时 PDF/PNG 文件
