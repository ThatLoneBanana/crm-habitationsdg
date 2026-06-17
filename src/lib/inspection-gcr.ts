import { prisma } from '@/lib/prisma';

// ── Inspections GCR : ancrage par nom + auto-création ──────────────────────
// L'ancre d'une inspection est un marqueur Tache.ancrageInspection (GYPSE /
// FINITION) posé sur UNE étape de cédule. L'inspection dérive sa date de
// l'étape marquée (sa dateDebut). Au plus un marqueur par (projet, type).

export type TypeAncrable = 'GYPSE' | 'FINITION';

// Marqueur posé par défaut sur l'étape au nom EXACT, à la création de cédule.
export const ANCRAGE_PAR_NOM: Record<string, TypeAncrable> = {
  'Pose gypse': 'GYPSE',
  'Pose finition': 'FINITION',
};

const TYPES_ANCRABLES: TypeAncrable[] = ['GYPSE', 'FINITION'];

function nomPourType(type: TypeAncrable): string | undefined {
  return Object.keys(ANCRAGE_PAR_NOM).find((n) => ANCRAGE_PAR_NOM[n] === type);
}

/**
 * Normalise les marqueurs d'ancrage d'une liste d'étapes (avant un
 * delete+recreate de cédule) :
 *  - PRÉSERVE un marqueur déjà posé (round-trip du modal) ;
 *  - DÉDOUBLONNE : au plus un marqueur par type (garde le 1er) ;
 *  - DÉFAUT : si un type n'a aucun marqueur, le pose sur la 1re étape dont le
 *    nom correspond EXACTEMENT (« Pose gypse » / « Pose finition »).
 * Idempotent : ne réécrit jamais un marqueur existant → ne casse pas une ancre
 * déplacée manuellement.
 */
export function appliquerAncrageDefaut<T extends { nom: string; ancrageInspection?: TypeAncrable | string | null }>(
  etapes: T[],
): T[] {
  const result = etapes.map((e) => ({ ...e }));
  for (const type of TYPES_ANCRABLES) {
    const indices = result.map((e, i) => (e.ancrageInspection === type ? i : -1)).filter((i) => i >= 0);
    if (indices.length > 0) {
      for (let k = 1; k < indices.length; k++) result[indices[k]].ancrageInspection = null;
    } else {
      const nomCible = nomPourType(type);
      const cible = result.find((e) => e.nom === nomCible);
      if (cible) cible.ancrageInspection = type;
    }
  }
  return result;
}

/** Garantit (idempotent) qu'un projet possède ses inspections GYPSE et FINITION. */
export async function ensureInspectionsGCR(projetId: string): Promise<void> {
  for (const type of TYPES_ANCRABLES) {
    const existe = await prisma.inspectionGCR.findFirst({ where: { projetId, type } });
    if (!existe) await prisma.inspectionGCR.create({ data: { projetId, type } });
  }
}
