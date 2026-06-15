---
name: habitationsdg-design
description: Use this skill to generate well-branded interfaces and assets for Habitations DG (CRM de construction résidentielle, québécois), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, brand assets, and UI kit components for prototyping.
user-invocable: true
---

# Habitations DG — Design System skill

Read `readme.md` first — it is the full design guide (company context, content voice, visual foundations, iconography, and an index of every file). Then explore the other files as needed.

## What's here
- `styles.css` — global entry point. Link this one file; it `@import`s all tokens + fonts.
- `tokens/` — `colors.css` (brand red, warm-neutral scale, phase palette, semantic), `typography.css` (Inter scale), `spacing.css` (4px grid, radius, elevation, motion), `fonts.css`, `base.css`.
- `components/core/` — reusable React primitives: Button, IconButton, Badge, PhaseBadge, StatusDot, Card/CardHeader, MetricCard, Input, Select, Toggle, Avatar, Tabs, ProgressBar. `components/feedback/` — Toast, Dialog, Skeleton, EmptyState. `components/navigation/` — SegmentedControl, FilterChip, Stepper. Each has a `.prompt.md` with usage.
- `ui_kits/crm/` — a full interactive CRM recreation (sidebar router): Dashboard, Liste des projets, Création de projet (4 étapes), Page projet, Cédule (Gantt consultation + édition), Costing (global + projet), Feuilles de temps, GCR, Clients & Fournisseurs, Carte (Leaflet), Paramètres, plus Vue mobile, Vue client publique and États & patterns. See its `README.md`.
- `Recommandations.html` — prioritized product recommendations document.
- `guidelines/*.html` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/` — logo lockup, H monogram, project-type glyphs.

## How to work
- **Language is Québec French**, always. Money is `1 234,56 $` (space thousands, comma decimal, trailing ` $`); compact `2,1 M$`. Dates `fr-CA` lowercase months. See the CONTENT FUNDAMENTALS section of `readme.md`.
- **Red `#DC2626` is the one action color** (one primary per view). **Green is health/positive, never a primary button.** Phases use the fixed 5-color palette (Signé/Préparation/Chantier/Livraison/Terminé). Icons are **Tabler** (`ti ti-*`).
- If creating visual artifacts (slides, mocks, throwaway prototypes), copy the assets you need out of `assets/` and produce static HTML files for the user to view. Link `styles.css` for tokens; load components from `_ds_bundle.js` via `window.HabitationsDGDesignSystem_<id>` (run `check_design_system` for the exact namespace) or just reuse the inline patterns from `ui_kits/crm/`.
- If working on production code, copy assets and read the rules here to design as an expert in this brand.

If the user invokes this skill without other guidance, ask what they want to build, ask a few focused questions, then act as an expert designer who outputs HTML artifacts **or** production code, depending on the need.
