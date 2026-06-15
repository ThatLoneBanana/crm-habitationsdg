# CLAUDE.md — CRM Habitations DG

Guide de référence pour toute contribution au code. **Lis ce fichier en entier avant d'écrire du code.** Il encode les conventions, le design system, et la logique métier du projet. Respecte-le sans dériver.

> Stack Next.js modifiée : ce projet utilise Next.js 16 (App Router) avec des conventions qui peuvent différer de tes connaissances. En cas de doute sur une API Next.js, consulte `node_modules/next/dist/docs/` avant d'écrire.

---

## 1. CONTEXTE PRODUIT

CRM de gestion de construction résidentielle pour **Habitations DG**, entreprise québécoise. Gère ~42 projets de construction simultanés, du contrat signé à la remise des clés. **Interface 100 % en français québécois.**

**Utilisateurs :**
- **Nicolas** (Savard) — directeur des opérations. Utilisateur principal. Consulte le dashboard chaque matin, sur laptop dans son camion et sur mobile.
- **Sophie-Rose** (Dion) — comptabilité. Paiements, extras, santé financière, feuilles de temps.
- **Vendeurs** — contrats, vues client.
- **Chargé de projet** (Louis Bellavance) — cédule, coordination de chantier.

**Surfaces du CRM :** Dashboard · Liste projets · Page projet (onglets Cédule · Extras · Paiements · GCR · Costing · Documents) · Création projet (4 étapes) · Clients · Fournisseurs · Carte · Costing · Feuilles de temps · Paramètres · Vue client publique.

---

## 2. STACK TECHNIQUE (ne pas dévier)

- **Next.js 16.2.7** (App Router, Turbopack) + TypeScript + dossier `src/`
- **React 19.2.4**
- **Supabase** (PostgreSQL + Auth)
- **Prisma 5.22.0** — NE PAS upgrader vers v7 (breaking changes incompatibles)
- **Tailwind CSS v4** + **shadcn/ui** + Radix
- **Police : Inter** (police de marque, exacte)
- **Icônes : Tabler Icons** (`ti ti-*`) comme source unique. Lucide toléré dans le legacy mais Tabler prime.
- **@react-pdf/renderer** (PDF) · **Resend** (courriels) · **react-leaflet + OpenStreetMap + Nominatim** (carte/géocodage)

### Gotchas techniques critiques
- Mot de passe DB contient `!` → URL-encoder en `%21` dans les chaînes de connexion
- Prisma lit `.env` et NON `.env.local`
- Enums Prisma sans accents → `JUMELE` pas `JUMELÉ`
- Types `Decimal` et `Date` de Prisma → sérialiser via `JSON.parse(JSON.stringify(data))` avant de passer à un Client Component
- Leaflet → import `dynamic` avec `ssr: false`
- SVG non supporté dans react-pdf → utiliser PNG (`/public/habitationsdg.png`)
- `useEffect` avec dépendance Date → utiliser `.getTime()` (primitif), jamais l'objet Date
- Toujours mettre `;` avant une ligne qui commence par `(` ou `[` (ASI JavaScript)

---

## 3. DESIGN SYSTEM (RÈGLES NON NÉGOCIABLES)

Le design system vit dans les tokens CSS (`src/styles/tokens/`). **Utilise toujours les variables CSS, jamais de couleurs hardcodées.** Si tu écris `#E5E7EB` ou `#6B7280` dans un composant, c'est une erreur — utilise le token.

### Couleurs — toujours via tokens
- **Rouge DG `--dg-red` (#DC2626)** = LA couleur d'action. Réservée au bouton primaire, à l'item de nav actif, et à la ligne « aujourd'hui » du Gantt. **Un seul bouton primaire par vue.** Le rouge est précieux.
- **Le vert (`--success` #1D9E75) signifie la santé, jamais « go ».** Le vert n'est JAMAIS un bouton primaire. Il signale la santé financière, l'argent reçu, les statuts « en cours »/« terminé ».
- **Ink near-black chaud** (`--n-900` #1F1D1B) sur **surfaces warm-neutral** (`--n-25` à `--n-200`). Pas de gris froid clinique.
- **Palette de phases** (5 couleurs, chacune bar/tint/ink) — valeurs EXACTES, ne jamais dériver :
  - Signé = bleu `#378ADD` · Préparation = violet `#7F77DD` · Chantier = orange `#EF9F27` · Livraison = vert `#639922` · Terminé = taupe `#B4B2A9`
- **Statuts de tâche Gantt** (calculés par date) : Terminé `#639922` · En cours (teal) `#1D9E75` · Commence demain (bleu) `#378ADD` · À venir (gris) `#B4B2A9` · ligne aujourd'hui rouge `#DC2626`

### Typographie
- **Inter, une seule famille**, 4 poids (400/500/600/700). Échelle dense 10–28px ; l'UI de travail vit à **11–14px**. Titres de page 18px semibold ; valeurs de métriques 22px ; titre adresse projet jusqu'à 28px.
- **Chiffres tabulaires partout** (montants, dates, compteurs) pour aligner les colonnes.

### Espacement, rayons, layout
- **Grille 4px.** Gutter de page 24px, gap de section 20px, padding de card 16px, gap de grille de métriques 10px. Densité = fonctionnalité.
- **Rayons modestes :** contrôles/lignes 6px, cards/inputs 8px, dialogs 14px, pills full.
- **Sidebar fixe 200px**, blanche, hairline à droite ; logo en haut, nav, puis bloc user/avatar épinglé en bas.

### Cards et bordures
- **Cards : blanches, bordure 1px `--border` (#E2E0DB), rayon 8px, AUCUNE ombre au repos.** En-têtes de section/table sur `--surface-subtle` avec hairline en bas.
- **Les bordures font le travail structurel, pas les ombres.** Ombres seulement pour ce qui flotte (dropdowns, dialogs, popovers).
- Zebra rows et teintes de semaine alternées (`--n-150`) portent les tableaux denses et la grille du Gantt.

### Interactions
- **Hover :** lignes/nav se remplissent d'une surface subtile (`--surface-hover`, ou `--dg-red-50` pour la nav). Pas d'opacité.
- **Press :** boutons descendent 1px (`translateY(1px)`) et foncent.
- **Focus :** anneau rouge 3px (`--ring-focus`).
- **Motion minimal et rapide** — 0.1–0.15s, ease-out. Pas d'animation décorative.

### Imagerie
- Le CRM est **chrome, pas imagerie** — aucune photo. Seules œuvres de marque : le monogramme H rouge et les glyphes de type (maison, jumelé, logement).

---

## 4. CONTENU & VOIX (français québécois)

- **Toujours en français québécois. Jamais d'anglais dans l'UI.** Vocabulaire du domaine : *cédule*, *étape*, *chantier*, *remise des clés*, *extra*, *corps de métier*, *fournisseur*, *vue client*, *échéancier*.
- **Ton : opérationnel, direct, calme.** Outil de travail, pas marketing. Phrases nominales courtes. Labels concrets : « Extras non signés », « Paiements attendus », « Valeur en chantier », « Envoyer la cédule ».
- **Casse : phrase** partout (titres, boutons, labels). Pas de Title Case, pas d'ALL-CAPS sauf les petits eyebrows en majuscules.
- **Montants format québécois OBLIGATOIRE :** `1 234,56 $` — espace comme séparateur de milliers, **virgule** décimale, ` $` après le chiffre. Compact : `2,1 M$`, `4 800 $`. **Utilise toujours `formatMontant()` / `formatMontantCourt()` de `src/lib/utils.ts`.** N'utilise JAMAIS `formatCurrency` (format US, à éliminer).
- **Dates : `fr-CA`**, mois en français minuscules (`20 juin 2026`, `avr`, `mai`). Durées : `3j ouvr.`, `43 jours ouvrables`.
- **Vocabulaire de statut figé.** Phases : *Signé · Préparation · Chantier · Livraison · Terminé.* Statut tâche : *Terminé · En cours · En préparation · À venir.* Ne pas inventer de synonymes.
- **Alertes spécifiques et actionnables** — chacune porte un *quoi*, un *montant*, une *adresse*.
- **Emoji : essentiellement aucun.** Un seul 👋 sur la salutation du dashboard. Le sens passe par icônes + couleur, jamais emoji.
- **Corps de métier nommés comme de vrais sous-traitants :** Plomberie Côté, Gypse Beauce, Élec. Vachon, Peinture Martin, Céramique Plus, Cuisines Beauce, Ventil. Express, Bomat, Canac, Rona.

---

## 5. LOGIQUE MÉTIER (ne JAMAIS modifier le comportement)

Ces fonctions sont le cœur du produit. Tu peux changer le visuel autour, jamais le comportement.

### Formatage (`src/lib/utils.ts`)
- `formatMontant(montant, decimales=2)` → `1 234,56 $`
- `formatMontantCourt(n)` → `2,1 M$` / `187 k$`
- `formatDate(date)` → `fr-CA` court

### Statut de tâche par date (`src/lib/task-status.ts`)
Calculé automatiquement, jamais manuel :
- `dateFin < aujourd'hui` → **Terminé** (vert)
- `dateDebut <= aujourd'hui <= dateFin` → **En cours** (teal)
- `dateDebut === demain` exactement → **En préparation** (bleu)
- sinon → **À venir** (gris, pas de badge)

### Cédule (`src/lib/cedula-utils.ts`)
- `addJoursOuvrables` / `subJoursOuvrables` — sautent samedi (6) et dimanche (0)
- `cascadeVersBas` — la prochaine étape débute à `addJoursOuvrables(prev.dateFin, 1 + bufferPrev)`. Le buffer = jours vides APRÈS une étape.
- `cascadeVersHaut` — recule en tenant compte du buffer de l'étape courante
- `calculerDepuisLivraison` — calcule à rebours depuis `dateLivraison - margeJours` (défaut 5)
- **`detecterConflits` — un conflit existe quand `dateFin[i] >= dateDebut[i+1]`** (le même jour EST un conflit dans ce projet). NE PAS modifier cette règle sans demande explicite.

### Règles cédule
- Prochaine étape commence toujours `addJoursOuvrables(dateFin, 1)`, jamais le même jour
- Largeur barre Gantt : `(dureeJours * MS / totalMs) * 100`, minimum 1.2 % pour visibilité
- Mode projet : étapes terminées verrouillées (vert), étape en cours = date début verrouillée, futures = modifiables
- Étapes 1-4 (Excavation, Fondations, Charpente, Mur extérieur) = internes, pas de date partagée client

### Paiements
- **Préliminaire** : acompte 15 000 $ + balance via notaire
- **Entreprise** : 50 % toiture + 35 % gypse + 15 % remise des clés

### Heures
- Max **36,5 h/semaine** par employé (paramétrable dans Paramètres). Indicateur rouge si dépassé.

---

## 6. ARCHITECTURE & CONVENTIONS

### Routing (déjà nettoyé)
- Page projet : `src/app/(dashboard)/projets/[id]/` (accepte slug ou id via fallback API). Le dossier `[slug]` a été supprimé.
- Vue client publique : `src/app/p/[token]/` uniquement. `vueclient/[slug]` supprimé.
- Routes API sous `src/app/api/`. L'UI dit « Étape » mais les routes restent `/api/taches`.

### Données vers Client Components
Toujours sérialiser les types Prisma : `const data = JSON.parse(JSON.stringify(prismaResult))` avant de passer en props.

### Server vs Client
- Données et calculs dans les Server Components quand possible
- Les Client Components reçoivent tout en props — **pas de fetch de leurs propres données** si le parent peut les fournir (évite les loaders infinis)

### Rôles (`src/lib/auth-roles.ts`)
- `ADMIN` et `DEVELOPPEUR` = accès total identique (paramètres, logs, tout)
- `COMPTABILITE` = tous projets, finances en écriture, pas la cédule
- `VENDEUR` = seulement ses projets (`vendeurId`), pas costing ni feuilles de temps
- `CHARGE_PROJET` = tous projets, cédule en écriture, pas les finances
- Onglets et liens sidebar masqués selon le rôle. Journal d'activité (`/parametres/logs`) visible ADMIN/DEV seulement, placé juste au-dessus de Paramètres dans la sidebar.

### Logs (`src/lib/logger.ts`)
Appeler `log()` dans les APIs importantes : `PROJET_CREE`, `CEDULE_MODIFIEE`, `EXTRA_SIGNE`, `PAIEMENT_RECU`, `LOGIN`.

---

## 7. RÈGLES DE TRAVAIL POUR CLAUDE CODE

1. **Ne touche jamais à la logique métier** (cascade, statuts, conflits, formatage) sans demande explicite. Visuel et structure seulement.
2. **Aucune couleur hardcodée.** Utilise les tokens CSS. Si un token manque, propose-le, ne hardcode pas.
3. **Un seul bouton primaire rouge par vue.** Jamais de bouton primaire vert.
4. **Tout en français québécois**, format montant `1 234,56 $`, dates `fr-CA`.
5. **Bordures, pas ombres**, pour les cards au repos.
6. **Quand tu déclines ou bloques sur quelque chose**, explique pourquoi et propose une alternative.
7. **Travaille par phases, confirme après chaque phase** avec une capture avant de continuer.
8. **Réfère-toi aux maquettes** dans `REF/ui_kits/crm/` et aux composants `REF/components/core/` comme cible visuelle.
9. **Ne réinvente pas** les fonctions qui existent (`formatMontant`, `calculateTaskStatus`, les utils de cédule).
10. **Préserve toute la logique existante** lors d'une refonte visuelle — fetch, calculs, props, états.

@AGENTS.md