# Structure du Projet CRM

## Organisation des dossiers

### `app/` - Routes Next.js App Router
- **(auth)** - Routes publiques (login, register)
- **(dashboard)** - Routes protégées avec layout sidebar
  - **projets/** - Gestion des projets
  - **clients/** - Gestion des clients
  - **fournisseurs/** - Gestion des fournisseurs
  - **parametres/** - Paramètres de l'app
- **p/[token]/** - Vue publique pour les clients (partageable)
- **api/** - Routes API (REST)

### `components/`
- **ui/** - Composants shadcn/ui (boutons, inputs, etc.)
- **layout/** - Composants de layout (Sidebar, Header)
- **projets/** - Composants spécifiques aux projets
- **cedule/** - Composants pour les calendriers/timeline
- **shared/** - Composants réutilisables

### `lib/`
- **supabase/** - Clients Supabase (browser & server)
- **prisma.ts** - Instance Prisma singleton
- **utils.ts** - Fonctions utilitaires (cn, formatDate, formatMontant)

### `types/`
- **index.ts** - Types TypeScript globaux et interfaces

## Variables d'environnement requises

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Commandes utiles

```bash
# Générer Prisma Client
npx prisma generate

# Pousser le schéma à la DB
npx prisma db push

# Lancer le serveur de dev
npm run dev

# Générer les types du schéma
npx prisma db execute
```
