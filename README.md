# ACKO Chat Design System

Unified design system for ACKO's conversational insurance UI — **17 widget components** across Health, Motor & Life LOBs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/design-system`.

## Architecture

| Tab | Purpose |
|-----|---------|
| **Base** | All 17 components with generic demo data |
| **Health** | Health-specific variants (family floater, hospitals, gap analysis) |
| **Motor** | Motor-specific variants (vehicle reg, IDV, NCB, add-ons) |
| **Life** | Life-specific variants (income, riders, underwriting) |

### Components

1. **ChatMessage** — Bot/user message bubbles with avatar
2. **TypingIndicator** — Animated typing dots
3. **SelectionCards** — Single/multi-select cards (grid & list layouts)
4. **GridSelector** — Multi-select grid with icons
5. **InputField** — Text, number, date, pincode inputs
6. **DatePicker** — Calendar date selection
7. **RangeSlider** — Value range with min/max
8. **SearchableList** — Filterable list with search
9. **SummaryCard** — Review/editable summary blocks
10. **ComparisonCard** — Side-by-side comparison
11. **PlanRecommendation** — Insurance plan cards with features
12. **PremiumBreakdown** — Itemized cost breakdown
13. **StepProgress** — Multi-step progress/timeline
14. **ActionButtons** — CTA buttons (primary, secondary, ghost)
15. **QuickActions** — Pill-shaped quick reply chips
16. **SuccessState** — Celebration/completion screens
17. **KYCVerification** — Identity verification flows

### Theme Modes

Three-way theme toggle (Dark / Light / System) — available at the top of the page.

## Tech Stack

- **Next.js 14** + TypeScript
- **Tailwind CSS** with ACKO design tokens
- **Framer Motion** for animations
- **Euclid Circular B** custom font

## Icon Library

All icons are served from `/public/icons/` with organized subdirectories:
- `generic/` — Universal icons
- `health-life/` — Health & Life LOB icons
- `car-bike/` — Motor LOB icons
