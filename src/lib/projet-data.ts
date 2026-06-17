import { prisma } from '@/lib/prisma';
import { calculerPhaseAutomatique } from '@/lib/phase-calculator';

// Accès données serveur (Prisma direct) — partagé par le Server Component de la
// fiche projet ET la route API. AUCUN fetch HTTP côté serveur.
//
// Sécurité : lecture INTERNE COMPLÈTE (id, slug, vendeur, finances, étapes
// internes…). Ne JAMAIS exposer cette lecture via la route publique filtrée
// (/api/projets-by-slug) — c'est une fonction serveur, pas un endpoint public.

/**
 * Lecture complète d'un projet par id OU slug. PURE : aucune écriture.
 * La phase est DÉRIVÉE des dates pour l'affichage (un Server Component n'écrit
 * pas pendant le rendu). `phasePersistee` est exposée pour les appelants (la
 * route API) qui veulent persister la phase hors-rendu.
 */
export async function getProjetComplet(idOrSlug: string) {
  const projet = await prisma.projet.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      client: true,
      vendeur: true,
      chargeProjet: true,
      taches: { orderBy: { ordre: 'asc' } },
      extras: true,
      paiements: true,
    },
  });
  if (!projet) return null;

  const phasePersistee = projet.phase;
  const phaseDerivee = calculerPhaseAutomatique(projet) as typeof projet.phase;
  return { ...projet, phase: phaseDerivee, phasePersistee };
}

/**
 * Lecture PUBLIQUE de la vue client par token (= slug). Allowlist STRICTE : ne
 * SELECT que ce qui est réellement rendu à l'écran client. AUCUN objet client
 * (nom/email/téléphone), AUCUN paiement, aucun champ interne/financier ne quitte
 * le serveur → la frontière public/privé est fermée à la racine (plus d'endpoint
 * public, plus de gros JSON). Renvoie null si le token ne résout pas.
 */
export async function getProjetVueClient(token: string) {
  const projet = await prisma.projet.findUnique({
    where: { slug: token },
    select: {
      adresse: true,
      ville: true,
      dateLivraison: true,
      taches: {
        where: { visibleClient: true },
        orderBy: { ordre: 'asc' },
        select: { id: true, nom: true, dateDebut: true, dateFin: true },
      },
      extras: {
        where: { statut: 'SIGNE' },
        select: { description: true, montant: true },
      },
      // Fournisseurs CONFIRMÉS seulement (le booléen confirme sert de FILTRE et
      // n'est PAS exposé). On n'expose QUE { nom, metier } — jamais budgetAlloue,
      // confirme, contact, ids.
      fournisseurs: {
        where: { confirme: true },
        select: { fournisseur: { select: { nom: true, metier: true } } },
      },
    },
  });
  if (!projet) return null;

  const parametres = await prisma.parametres.findUnique({
    where: { id: 'singleton' },
    select: { nomCompagnie: true, rbq: true, siteWeb: true },
  });

  return { projet, parametres };
}

/** Paramètres d'entreprise (singleton). Lecture pure. */
export async function getParametres() {
  return prisma.parametres.findUnique({ where: { id: 'singleton' } });
}

/** Périodes non ouvrables GLOBALES (vacances/fériés). Lecture pure — alimentent
 *  le moteur de cédule (jours ouvrables conscients des vacances). */
export async function getPeriodesNonOuvrables() {
  return prisma.periodeNonOuvrable.findMany({ orderBy: { dateDebut: 'asc' } });
}
