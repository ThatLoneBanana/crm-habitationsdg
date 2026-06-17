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

/** Paramètres d'entreprise (singleton). Lecture pure. */
export async function getParametres() {
  return prisma.parametres.findUnique({ where: { id: 'singleton' } });
}
