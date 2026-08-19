# Incubyte-Inspired Design System
## ACME Salary Management System

This design system is modeled directly on the branding of **Incubyte (incubyte.co)**. It blends engineering rigor with a modern, high-contrast tech aesthetic using deep greens, electric lime accents, soft cyans, and clean editorial typography.

---

## 1. Brand Essence

The design combines **structural engineering discipline** (clean lines, tabular layouts, precise spacing) with **adaptive flexibility** (smooth hover transitions, electric accents, readable dashboards). It feels like a premium, modern developer tool rather than a generic HR system.

---

## 2. Color Palette

Our theme relies on deep container shades with bright neon highlights.

### 2.1 Core Brand Colors

| Color | Hex | Sample | Role / Usage |
|---|---|---|---|
| **Deep Forest Green** | `#014D43` | ![#014D43](https://placehold.co/15x15/014d43/014d43.png) | Primary brand color, primary buttons, major headers |
| **Electric Chartreuse** | `#D3FE73` | ![#D3FE73](https://placehold.co/15x15/d3fe73/d3fe73.png) | Brand highlight, primary active state, focus rings |
| **Soft Lime Green** | `#CBDF7A` | ![#CBDF7A](https://placehold.co/15x15/cbdf7a/cbdf7a.png) | Secondary highlight, badges, accent borders |
| **Soft Cyan** | `#5DC6D6` | ![#5DC6D6](https://placehold.co/15x15/5dc6d6/5dc6d6.png) | Info state, secondary indicators, custom graph lines |

### 2.2 Neutral Colors (Dark Theme Focus)

| Color | Hex | Sample | Role / Usage |
|---|---|---|---|
| **Deep Space Navy** | `#060A1E` | ![#060A1E](https://placehold.co/15x15/060a1e/060a1e.png) | Main page background (dark mode), deep shadow basis |
| **Card / Row Dark** | `#0B1333` | ![#0B1333](https://placehold.co/15x15/0b1333/0b1333.png) | Card background, table header, modal background |
| **Off-White Text** | `#F1F1F2` | ![#F1F1F2](https://placehold.co/15x15/f1f1f2/f1f1f2.png) | Primary text on dark backgrounds |
| **Muted Grey** | `#9BA3B2` | ![#9BA3B2](https://placehold.co/15x15/9ba3b2/9ba3b2.png) | Secondary text, placeholders, labels |
| **Border Dark** | `#1E294B` | ![#1E294B](https://placehold.co/15x15/1e294b/1e294b.png) | Divider lines, table borders, card borders |

### 2.3 Neutral Colors (Light Theme Options)

| Color | Hex | Sample | Role / Usage |
|---|---|---|---|
| **Light Mint Tint** | `#EBFFF6` | ![#EBFFF6](https://placehold.co/15x15/ebfff6/ebfff6.png) | Light mode main page background |
| **Pure White** | `#FDFDFD` | ![#FDFDFD](https://placehold.co/15x15/fdfdfd/fdfdfd.png) | Light mode card backgrounds |
| **Border Light** | `#CFD6DC` | ![#CFD6DC](https://placehold.co/15x15/cfd6dc/cfd6dc.png) | Light mode borders |

---

## 3. Typography

The design features an editorial pairing of a **classic, high-contrast serif** for headers and a **clean, highly legible sans-serif** for body and data grids.

- **Primary Headings (H1, H2, H3):** `Fraunces`, Serif
  - *Weights:* 500 (Medium), 600 (Semi-Bold)
  - *Usage:* Page titles, main numbers in KPI cards
- **Body & Interface Text:** `Inclusive Sans`, Sans-Serif (or fallback `IBM Plex Sans` / `-apple-system`)
  - *Weights:* 400 (Regular), 500 (Medium), 700 (Bold)
  - *Usage:* Table contents, labels, navigation, reports
- **Monospace (Data / ID values):** `JetBrains Mono` or `Courier New`
  - *Usage:* Employee IDs (`EMP-00021`), currency figures, salary numbers

---

## 4. UI Components & Patterns

### 4.1 Buttons
- **Primary Button:**
  - Background: Deep Forest Green (`#014D43`)
  - Text: Off-White (`#F1F1F2`)
  - Hover: Background shifts to light transition; text/border active highlight in Electric Chartreuse (`#D3FE73`).
- **Secondary Button:**
  - Background: Transparent with Border (`#1E294B`)
  - Text: Off-White (`#F1F1F2`)
  - Hover: Border and Text change to Soft Cyan (`#5DC6D6`).
- **Border Radius:** `8px` (Medium/Clean, not fully rounded) for technical precision.

### 4.2 Cards
- **Background:** Card Dark (`#0B1333`)
- **Border:** `1px solid #1E294B`
- **Shadow:** Subtle dark shadow (`rgba(0, 0, 0, 0.4) 0px 4px 12px`)
- **Title Style:** `Inclusive Sans`, uppercase, tracked, muted color (`#9BA3B2`), size `12px` (Regular)
- **Value Style:** `Fraunces`, size `32px` (Medium), color (`#F1F1F2` or `#D3FE73`)

### 4.3 Data Tables
- **Header Row:** Background (`#0B1333`), bottom border (`#1E294B`), text `9BA3B2` (bold, 12px)
- **Data Rows:** Background transparent, bottom border (`#1E294B` - very thin), hover state transition to `#0F1B4C` (subtle midnight highlights)
- **Status Badges:**
  - `ACTIVE`: Background `rgba(1, 77, 67, 0.2)` (Green tint), border `rgba(1, 77, 67, 0.4)`, text `#CBDF7A`
  - `INACTIVE`: Background `rgba(207, 46, 46, 0.1)` (Red tint), border `rgba(207, 46, 46, 0.3)`, text `#FF8E8E`

---

## 5. Tailwinds Configuration (Design Tokens Map)

To implement this design system in Tailwind CSS, the theme extensions will be configured as follows:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#014D43',     // Deep Forest Green
          secondary: '#CBDF7A',   // Soft Lime
          accent: '#5DC6D6',      // Soft Cyan
          active: '#D3FE73',      // Electric Chartreuse
        },
        bg: {
          space: '#060A1E',       // Main Space Background
          card: '#0B1333',        // Card & Modal Background
          mint: '#EBFFF6',        // Light Mint Tint
        },
        text: {
          primary: '#F1F1F2',     // Primary Off-White
          muted: '#9BA3B2',       // Muted secondary label
        },
        border: {
          dark: '#1E294B',
          light: '#CFD6DC',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Inclusive Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    }
  }
}
```
