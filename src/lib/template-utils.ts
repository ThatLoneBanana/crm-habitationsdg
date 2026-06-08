export const ETAPES_NOMS = [
  'Excavation', 'Fondations', 'Charpente', 'Mur extérieur',
  'Plombier fond de cave', 'Couler plancher intérieur',
  'Intérieur division', 'Installation foyer', 'Intérieur division (2)',
  'Mesure armoire', 'Air climatisé', 'Électricien + TV & Tél',
  'Plombier', 'Échangeur d\'air', 'Isolation entretoit',
  'Mesure finition', 'Final menuiserie', 'Entrée gypse',
  'Pose gypse', 'Tireur de joints', 'Entrée finition',
  'Pose finition', 'Peinture', 'Livraison céramique',
  'Pose céramique', 'Coulis', 'Livraison armoire',
  'Pose armoire', 'Dosseret', 'Livraison fixture',
  'Finition électrique + TV & Tél', 'Finition plomberie',
  'Finition échangeur d\'air', 'Air climatisé final',
  'Installation porte de douche', 'Pose escalier ou rampe',
  'Pose plancher', 'Petite finition', 'Peinture finale',
  'Pose miroir + tablettes', 'Service +', 'Pose tapis', 'Ménage'
];

export const DUREES_DEFAUT: Record<string, number> = {
  'Excavation': 3,
  'Fondations': 5,
  'Charpente': 10,
  'Mur extérieur': 5,
  'Plombier fond de cave': 2,
  'Couler plancher intérieur': 1,
  'Intérieur division': 3,
  'Installation foyer': 2,
  'Intérieur division (2)': 1,
  'Mesure armoire': 1,
  'Air climatisé': 1,
  'Électricien + TV & Tél': 2,
  'Plombier': 1,
  'Échangeur d\'air': 1,
  'Isolation entretoit': 1,
  'Mesure finition': 1,
  'Final menuiserie': 2,
  'Entrée gypse': 1,
  'Pose gypse': 3,
  'Tireur de joints': 5,
  'Entrée finition': 1,
  'Pose finition': 3,
  'Peinture': 3,
  'Livraison céramique': 1,
  'Pose céramique': 2,
  'Coulis': 1,
  'Livraison armoire': 1,
  'Pose armoire': 1,
  'Dosseret': 1,
  'Livraison fixture': 1,
  'Finition électrique + TV & Tél': 1,
  'Finition plomberie': 1,
  'Finition échangeur d\'air': 1,
  'Air climatisé final': 1,
  'Installation porte de douche': 1,
  'Pose escalier ou rampe': 1,
  'Pose plancher': 2,
  'Petite finition': 1,
  'Peinture finale': 2,
  'Pose miroir + tablettes': 1,
  'Service +': 1,
  'Pose tapis': 1,
  'Ménage': 1,
};

export const ASSIGNATIONS_DEFAUT: Record<string, string> = {
  'Plombier fond de cave': 'Plomberie Côté',
  'Plombier': 'Plomberie Côté',
  'Finition plomberie': 'Plomberie Côté',
  'Électricien + TV & Tél': 'Élec. Vachon',
  'Finition électrique + TV & Tél': 'Élec. Vachon',
  'Échangeur d\'air': 'Ventil. Express',
  'Finition échangeur d\'air': 'Ventil. Express',
  'Air climatisé': 'Ventil. Express',
  'Air climatisé final': 'Ventil. Express',
  'Entrée gypse': 'Gypse Beauce',
  'Pose gypse': 'Gypse Beauce',
  'Tireur de joints': 'Gypse Beauce',
  'Mesure armoire': 'Cuisines Beauce',
  'Livraison armoire': 'Cuisines Beauce',
  'Pose armoire': 'Cuisines Beauce',
  'Dosseret': 'Cuisines Beauce',
  'Livraison céramique': 'Céramique Plus',
  'Pose céramique': 'Céramique Plus',
  'Coulis': 'Céramique Plus',
  'Peinture': 'Peinture Martin',
  'Peinture finale': 'Peinture Martin',
};

export const ETAPES_INTERNES = [
  'Excavation',
  'Fondations',
  'Charpente',
  'Mur extérieur',
  'Plombier fond de cave',
  'Couler plancher intérieur',
  'Intérieur division',
  'Installation foyer',
];

export function subJoursOuvrables(date: Date, n: number): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() - 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return d;
}

export function addJoursOuvrables(date: Date, n: number): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() + 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return d;
}

export function countJoursOuvrables(dateDebut: Date, dateFin: Date): number {
  let count = 0;
  let current = new Date(dateDebut);
  current.setHours(0, 0, 0, 0);
  const fin = new Date(dateFin);
  fin.setHours(0, 0, 0, 0);

  while (current <= fin) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function genererSlug(prenom: string, nom: string, adresse: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const numAdresse = adresse.match(/^\d+/)?.[0] || '';
  const rueClean = adresse
    .replace(/^\d+\s*/, '')
    .split(' ')[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');

  return `${normalize(prenom)}${normalize(nom)}-${numAdresse}-${rueClean}`;
}

export function detecterConflits(etapes: any[]): number[] {
  const conflits: number[] = [];
  for (let i = 0; i < etapes.length - 1; i++) {
    const d1 = new Date(etapes[i].dateFin);
    const d2 = new Date(etapes[i + 1].dateDebut);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (d1 >= d2) {
      conflits.push(i);
      conflits.push(i + 1);
    }
  }
  return [...new Set(conflits)];
}
