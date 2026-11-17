# HSK UI V14 — RESPONSIVE & ACCESSIBILITY QA SPECIFICATION

## 1. Breakpoint Matrix

| Breakpoint | Target Devices | Layout Behavior |
| :--- | :--- | :--- |
| **Desktop Wide ($\ge 1280\text{px}$)** | 24"-32" Monitors, Desktops | Full 3-column exam room (`250px` left navigator, `1fr` center, `270px` right timer), 4-column catalog card grid. |
| **Laptop / Tablet Landscape ($1024\text{px} - 1279\text{px}$)** | MacBooks, Surfaces, iPads Landscape | 3-column exam room with compact padding, 3-column catalog grid. |
| **Tablet Portrait ($768\text{px} - 1023\text{px}$)** | iPads Portrait, Tablets | Left navigator collapses into slide-over drawer; right timer stays pinned in top-bar; center question expands to full width; 2-column catalog grid. |
| **Mobile ($\le 767\text{px}$)** | iPhones, Android devices | Single column stacked layout; modal sheets; bottom action bar for navigation; 1-column catalog grid. |

---

## 2. Touch & Tap Targets
- **Target Size**: All interactive buttons, cards, and bubbles maintain a minimum tap target of $44 \times 44\text{px}$ (or $48\text{px}$ for primary CTAs) according to WCAG 2.1 Level AA standards.
- **Navigator Bubbles**: Minimum $32\text{px}$ visual size with $6\text{px}$ outer hit margin padding to guarantee effortless finger tap without misclicks.

---

## 3. Accessibility Standards (WCAG 2.1 AA)
- **Focus Rings**: All interactive elements provide visible 2px teal focus rings (`outline: 2px solid var(--v14-color-primary); outline-offset: 2px;`) during keyboard navigation (`Tab` / `Shift+Tab`).
- **Semantic Roles**:
  - `role="radiogroup"` and `role="radio"` with `aria-checked` on choice options.
  - `role="tablist"`, `role="tab"`, and `aria-selected` on skill and explanation tabs.
  - `role="timer"` with descriptive live label on `DigitalTimer`.
  - `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` on `AudioPlayerBar`.
  - `aria-expanded` on accordion and modal toggles.
- **Color Contrast**: All text elements exceed the WCAG AA minimum contrast ratio of 4.5:1 against their backgrounds (e.g., `#0f172a` on white = 16.5:1; `#0d9488` on white = 4.6:1).
