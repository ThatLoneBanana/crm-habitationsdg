# Habitations DG — Design System

A design system for **Habitations DG**, a Québec residential‑construction company. It powers an internal **CRM** that tracks ~42 simultaneous construction projects from signed contract to handing over the keys (*remise des clés*). The interface is entirely in **Québec French**.

> Aesthetic north star: **Linear / Notion applied to construction** — clean, information‑dense but legible, professional. Fine borders, crisp cards, clear typographic hierarchy. Faithful to the red/black DG identity and the data density a construction crew needs daily.

---

## Who uses it

| User | Role | Context |
|---|---|---|
| **Nicolas** (Savard) | Directeur des opérations | Laptop in his truck + mobile. Primary user. Checks the dashboard every morning. |
| **Sophie‑Rose** (Dion) | Comptabilité | Payments, extras, financial health. |
| Vendeurs | Sales | Contracts, client views. |
| Chargé de projet | Project lead | Schedule (*cédule*), site coordination. |

## The product (CRM surfaces)

- **Dashboard** — Nicolas's morning view: greeting, 5 KPI metrics, priority alerts, the week's agenda grouped by day, and a rail of every project with phase + progress.
- **Page projet** — one project: header (address, client, phase, contract type/amount, delivery date) + tabs **Cédule · Extras · Paiements · GCR · Costing · Documents**.
- **Cédule (échéancier)** — the heart of the app. A bespoke **Gantt** for a 43‑step construction schedule, with a **consultation mode** and an **edit mode** (date nudge buttons, buffers, trade assignment, client‑visibility toggle, conflict detection, locked completed steps).
- Other surfaces in the codebase: Clients, Fournisseurs (suppliers/trades), Carte (map), Costing, Feuilles de temps (timesheets), Paramètres, plus a public client view (`/vueclient`, `/p/[token]`).

---

## Sources

This system was reverse‑engineered from the production codebase. Nothing here assumes you have access — it is recorded so you can re‑derive it if you do.

- **Codebase** (read‑only, mounted): `crm-habitationsdg/` — a **Next.js 15 / React 19** app, Prisma + Supabase, Tailwind v4 + shadcn/ui. Key files studied:
  - `src/app/globals.css` — the original (grayscale shadcn/OKLCH) tokens this system replaces.
  - `src/lib/utils.ts` — `formatMontant`, `formatMontantCourt`, `formatDate` (the Québec money/date formats).
  - `src/lib/task-status.ts` — auto status of a task by date (terminé / en cours / préparation / à venir).
  - `src/lib/cedula-utils.ts` — working‑day date math, cascade up/down with buffers, **conflict detection** (`dateFin[i] >= dateDebut[i+1]`).
  - `src/lib/phase-calculator.ts` — auto project phase (Signé → Préparation → Chantier → Livraison → Terminé).
  - `src/lib/template-defaut.ts` — the canonical **43 construction steps**.
  - `src/components/dashboard/DashboardClient.tsx`, `src/components/cedule/*` (Gantt + editor), `src/components/layout/Sidebar.tsx`, `src/components/ui/*` (shadcn primitives).
  - `prisma/seed.ts` — realistic clients, projects, trades, payments, extras used throughout this system.
- **Logo**: `uploads/habitationsdg.svg` (also `assets/habitationsdg.svg`).

> ⚠️ **Font note:** the brand font is **Inter** — an exact match, freely available on Google Fonts, loaded via `tokens/fonts.css`. No substitution was needed. For offline/production delivery, self‑host the woff2 files and swap the `@import` for `@font-face` rules.

---

## CONTENT FUNDAMENTALS

How the product talks. **Match this voice in every screen, label and string.**

- **Language: Québec French, throughout.** Never English in the UI. Use the domain's own words: *cédule* (schedule), *étape* (step), *chantier* (job site), *remise des clés*, *extra* (change order), *corps de métier* (trade), *fournisseur*, *vue client*, *échéancier*.
- **Tone: operational, direct, calm.** It's a working tool for busy people, not marketing. Short noun phrases over sentences. Labels are concrete: "Extras non signés", "Paiements attendus", "Valeur en chantier", "Envoyer la cédule".
- **Address the user warmly but briefly.** The dashboard greets *"Bonjour Nicolas 👋"* — first name, friendly, one emoji max as a human touch. Everywhere else: no second‑person, no chatter. The product states facts; it doesn't editorialize.
- **Casing: sentence case** for everything — titles, buttons, labels ("Alertes prioritaires", "Agenda de la semaine", "Modifier", "Vue client"). No Title Case, no ALL‑CAPS except the small uppercase eyebrows/section labels in this system.
- **Numbers are Québec‑formatted.** Money: `1 234,56 $` — space as thousands separator, **comma** decimal, trailing ` $` (e.g. `187 500,00 $`). Compact: `2,1 M$`, `4 800 $`, `187 k$`. Dates: `fr-CA`, e.g. `20 juin 2026`, short `avr`, `mai`, `juin`. Days/months spelled in French and **lowercase** (`lundi`, `février`). Durations: `3j ouvr.`, `43 jours ouvrables`.
- **Status language is fixed vocabulary.** Phases: *Signé · Préparation · Chantier · Livraison · Terminé.* Task status: *Terminé · En cours · En préparation · À venir.* Don't invent synonyms.
- **Alerts are specific and actionable** — each carries a *what*, an *amount*, and an *address*: "Livraison imminente · 18 Rue des Érables · 8j", "Extra non signé · 4 800 $", "Paiement en retard · 187 500 $".
- **Emoji: essentially none in chrome.** A single 👋 on the dashboard greeting is the one sanctioned flourish. Status and meaning are carried by **icons + color**, never emoji. (The legacy code used 📅🚩 in a couple of editor banners — this system replaces those with real icons.)
- **Trades are named like real subcontractors:** "Plomberie Côté", "Gypse Beauce", "Élec. Vachon", "Peinture Martin", "Céramique Plus", "Cuisines Beauce", "Ventil. Express", "Bomat", "Canac", "Rona". Use these as sample data.

---

## VISUAL FOUNDATIONS

The look, and the rules behind it. See the **Design System tab** for live specimen cards.

### Color
- **Red is the action color, used sparingly.** `--dg-red` `#DC2626` is reserved for the primary button, the active nav item, and the "today" line on the Gantt. The brighter `--dg-red-logo` `#EA1C24` is for the monogram mark only. Red is precious — one primary action per view.
- **Green means health, never "go".** Per brand rule, **green is never a primary button.** It signals positive financial status, money received, and "en cours" / "terminé" task health (`--success` `#1D9E75`, plus the livraison green `#639922`).
- **Near‑black warm ink** (`--n-900` `#1F1D1B`) on **warm‑neutral surfaces** (`--n-25`→`--n-200`). The faint warmth (vs. clinical cool gray) ties the UI to the construction domain and to the taupe "Terminé" phase. Cards are crisp white (`--n-0`) on a barely‑warm canvas.
- **The phase palette is a first‑class system** — five lifecycle colors, each with a solid *bar*, a *tint* background, and an *ink* text color: Signé (blue `#378ADD`), Préparation (violet `#7F77DD`), Chantier (orange `#EF9F27`), Livraison (green `#639922`), Terminé (taupe `#B4B2A9`). These exact values come from the production CRM and must not drift.
- **Gantt status colors** are computed from dates: Terminé `#639922`, En cours (teal) `#1D9E75`, Commence demain (blue) `#378ADD`, À venir (gray) `#B4B2A9`; the **today line** is red `#DC2626`.
- Semantic set: warning amber `#D97706`, danger red `#DC2626`, info blue `#2563EB` — each with a tint + ink pair.

### Type
- **Inter, one family, four weights** (400/500/600/700). Dense scale 10–28px; the working UI lives at **11–14px**. Page/section titles 18px semibold; metric figures 22px semibold; project address title up to 28px.
- **Tabular figures everywhere numeric** — money, dates, counts, durations — so columns align. Negative letter‑spacing (`-0.018em`) on large figures; a wide‑tracked uppercase eyebrow for section labels.

### Spacing, radius, layout
- **4px base grid.** Page gutter 24px, section gap 20px, card padding 16px, metric‑grid gap 10px. Tight and deliberate — density is a feature.
- **Radii are modest:** controls/rows 6px, cards & inputs 8px, dialogs 14px, pills full. Nothing is overly rounded.
- **Fixed left sidebar, 200px**, white with a hairline right border; logo top, nav, then user/avatar pinned bottom. Content scrolls; the dashboard's right project rail is a fixed ~340px column.

### Cards, borders, elevation
- **Cards: white, 1px `--border` (#E2E0DB), 8px radius, no shadow at rest.** Section/table headers sit on `--n-50` with a bottom hairline. This is the dominant container — flat, bordered, crisp (Notion/Linear, not "SaaS card with big shadow").
- **Shadows are soft and low**, used only for things that float (dropdowns, dialogs, popovers): `--shadow-md` for menus, `--shadow-lg`/`--shadow-pop` for dialogs. Never on resting cards.
- **Borders do the structural work**, not shadow. Zebra rows and alternating‑week tints (`--n-150`) carry the dense tables and the Gantt grid.

### Hover, press, focus, motion
- **Hover:** rows/nav fill with a subtle surface (`--surface-hover`, or `--dg-red-50` for nav); buttons darken (primary → `--dg-red-hover`). Opacity isn't used for hover.
- **Press:** buttons nudge down 1px (`translateY(1px)`) and darken to `--accent-press`. No bouncy scaling.
- **Focus:** a 3px red ring (`--ring-focus`), info‑blue ring on info controls.
- **Motion is minimal and quick** — 0.1–0.15s, `ease-out`. Fades and small position shifts only; no decorative looping animation. The product should feel instant.

### Imagery
- The CRM is **chrome, not imagery** — there are no photos in the app. The only brand artwork is the red **H monogram** and project‑type glyphs (maison, jumelé, logement). Keep surfaces clean; let data and the phase palette carry the visual interest.

---

## ICONOGRAPHY

- **Primary icon set: [Tabler Icons](https://tabler.io/icons)** (`ti ti-*` webfont), used across the dense screens (dashboard metrics, alerts, agenda, list headers). Outline style, ~1.75px stroke, 16–18px in chrome. Loaded from the Tabler CDN — see any UI‑kit `index.html`. The legacy app also pulled a few **lucide‑react** icons in the sidebar; Tabler and Lucide share the same clean outline language, so Tabler is the single source of truth here. **No substitution flagged — Tabler is what the product uses.**
- **Brand marks (in `assets/`)**: `habitationsdg.svg` (full lockup: red H + "HABITATIONS DG"), `habitationsdg.png` (raster), `habitationsdg-icon.svg` (the H monogram alone, recolored to `--dg-red` for standalone use).
- **Project‑type glyphs (in `assets/`)**: `maison.svg` (single house), `jumele.svg` (semi‑detached — one roof, centre party‑wall, **two doors**), `logement.svg` (multi‑unit building) — Lucide‑style line pictograms (stroke `currentColor`, 2px, round caps) used to tag a project's `typeProjet`.
- **Emoji are not used** as UI icons (one 👋 on the greeting aside). Meaning is carried by Tabler icons + the color system. **Unicode arrows** appear as lightweight affordances only: `↳` for "next step" in lists, `→`/`←` where a glyph is cheaper than an icon.

---

## Index — what's in this folder

**Foundations**
- `styles.css` — global entry (link this one file). Imports → `tokens/`.
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` · `tokens/fonts.css` · `tokens/base.css`
- `guidelines/*.html` — foundation specimen cards (Type, Colors, Spacing, Brand) shown in the Design System tab.

**Assets** — `assets/` — logos, monogram, project‑type glyphs.

**Components** — `components/<group>/` — reusable React primitives (see each `*.prompt.md`):
- `components/core/` — Button, IconButton, Badge, PhaseBadge, StatusDot, Card/CardHeader, MetricCard, Input, Select, Toggle, Avatar, Tabs, ProgressBar.
- `components/feedback/` — Toast/ToastStack, Dialog (confirmations + cascade alert), Skeleton/SkeletonRow, EmptyState.
- `components/navigation/` — SegmentedControl, FilterChip, Stepper.

**UI kit** — `ui_kits/crm/` — a full interactive CRM recreation (sidebar router; click any nav item). Entry: `ui_kits/crm/index.html`. Screens:
- **Dashboard** · **Liste des projets** (table, phase filters, search) · **Création de projet** (4-step flow with « passer la cédule ») · **Page projet** (tabs) · **Cédule** (Gantt consultation + édition) · **Costing** (page globale + onglet projet) · **Feuilles de temps** (Consultation / Saisie / Employés) · **GCR** (checklist, inspections, journal) · **Clients & Fournisseurs** (cartes / liste) · **Carte** (Leaflet, marqueurs par phase, légende-filtre) · **Paramètres** (Général / Mon compte / Utilisateurs / Journal).
- Design-showcase screens: **Vue mobile** (dashboard + projet), **Vue client publique** (mobile-first, lecture seule), **États & patterns** (empty states, skeletons, toasts, dialogs, alerte de décalage en cascade).
- Data + business logic: `data.js` (formatage québécois, cascade jours ouvrables, statut auto, 43 étapes, projets) and `data-ext.js` (clients, fournisseurs, employés, costing, feuilles de temps, GCR, géo, utilisateurs, journal).

**Document** — `Recommandations.html` — prioritized product recommendations (12 propositions, by user & impact).

**Skill** — `SKILL.md` — makes this folder usable as a downloadable Agent Skill.

---

*Built from the production `crm-habitationsdg` codebase. The functional logic — working‑day date cascades, buffers, conflict detection, phase/status computation, Québec money formatting — is the product's; this system gives it a more considered visual direction without changing the behavior.*
