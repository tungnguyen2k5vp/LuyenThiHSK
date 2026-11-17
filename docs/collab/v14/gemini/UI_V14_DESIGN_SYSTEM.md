# HSK UI V14 — DESIGN SYSTEM ARCHITECTURE

## 1. Overview
HSK UI V14 introduces a refreshed presentation system inspired by the visual clarity, high contrast, and ergonomic efficiency of leading language testing platforms (such as Migii HSK), while establishing an independent visual identity for `LuyenThiHSK`.

The design system is scoped under the CSS namespace `.hsk-ui-v14` to prevent any bleed into legacy V12/V13 views.

---

## 2. Token Architecture

### 2.1 Color Palette
The primary brand palette uses an oceanic teal scheme that provides high contrast without eye fatigue during 35–120 minute exam sessions:

| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | `--v14-color-primary` | `#0d9488` (Teal 600) | Primary CTAs, active tab underline, current question bubble |
| **Primary Hover** | `--v14-color-primary-hover` | `#0f766e` (Teal 700) | Button hover states |
| **Primary Active** | `--v14-color-primary-active` | `#115e59` (Teal 800) | Text accents, active bubble rings |
| **Primary Light** | `--v14-color-primary-light` | `#f0fdfa` (Mint 50) | Selected option backgrounds, card highlights |
| **Primary Border** | `--v14-color-primary-border` | `#99f6e4` (Teal 200) | Borders for active choices |
| **Success** | `--v14-color-success` | `#16a34a` (Green 600) | Correct answer indicators, passing badges |
| **Error** | `--v14-color-error` | `#ef4444` (Red 500) | Incorrect answer indicators, failing badges |
| **Amber** | `--v14-color-amber` | `#f59e0b` (Amber 500) | In-progress tags, warning alerts |
| **Surface** | `--v14-color-surface` | `#ffffff` | Card surfaces, modal bodies |
| **Surface Soft** | `--v14-color-surface-soft` | `#f8fafc` | Screen background, sub-question cards |
| **Border** | `--v14-color-border` | `#e2e8f0` | Standard card and separator borders |
| **Text Main** | `--v14-color-text-main` | `#0f172a` (Slate 900) | Primary headings, Hanzi text |
| **Text Body** | `--v14-color-text-body` | `#334155` (Slate 700) | Standard instructions and body text |
| **Text Muted** | `--v14-color-text-muted` | `#94a3b8` (Slate 400) | Helper notes, disabled states |

### 2.2 Typography Scale
Optimized specifically for dual-script readability: Vietnamese Latin characters + Simplified Chinese Hanzi + Pinyin tonemarks:

- **Hanzi Font Stack**: `'PingFang SC', 'Microsoft YaHei', 'SimSun', 'Noto Sans SC', sans-serif`
- **Pinyin Font Stack**: `'Segoe UI', 'Inter', 'Roboto', sans-serif`
- **Scale**:
  - `xs`: `0.75rem` (12px) - Status tags, audio timestamps
  - `sm`: `0.875rem` (14px) - Option subtext, table headers
  - `base`: `1.0rem` (16px) - Questions, answers, standard buttons
  - `lg`: `1.125rem` (18px) - Sub-headers, dialogue pinyin
  - `xl`: `1.25rem` (20px) - Dialogue Hanzi
  - `2xl`: `1.5rem` (24px) - Card headers, modal titles
  - `3xl`: `1.875rem` (30px) - Exam titles, digital timer digits

### 2.3 Spacing & Radii
- **Spacing**: Base 4px grid (`--v14-space-1: 4px`, `--v14-space-2: 8px`, `--v14-space-3: 12px`, `--v14-space-4: 16px`, `--v14-space-6: 24px`, `--v14-space-8: 32px`).
- **Radii**: Smooth modern rounding (`--v14-radius-md: 8px`, `--v14-radius-lg: 12px`, `--v14-radius-xl: 16px`, `--v14-radius-2xl: 20px`, `--v14-radius-full: 9999px`).

---

## 3. Primitives Catalog
All primitives are self-contained, typed, and accessibility-compliant:
1. `Button`: Variants (`primary`, `secondary`, `outline`, `ghost`), sizes (`sm`, `md`, `lg`), `fullWidth`, `isLoading`. Min touch target $\ge 44\text{px}$.
2. `Card`: Interactive and default surfaces with elevation tokens.
3. `Badge`: Status indicators for exam tags, skill pills, and pass/fail indicators.
4. `DigitalTimer`: Dual-box segmented countdown display (`31 : 38`), with warning pulse under 5 minutes.
5. `ToggleSwitch`: Accessible ARIA switch for Practice vs Mock Exam mode.
6. `AudioPlayerBar`: Primary listening controller with play/pause, current/duration timestamps, interactive progress scrubber, and volume control.
7. `MiniAudioPlayer`: Compact listening controller designed for matching sub-questions.
8. `EmptyState`: Friendly placeholder with icon, description, and action button.
