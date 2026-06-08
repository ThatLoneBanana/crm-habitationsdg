// Templates hardcodés avec les 43 étapes de construction
// Utilisés pour éviter les appels API et les boucles infinies

export interface TemplateEtape {
  nom: string;
  jours: number;
  assigneA: string | null;
  visibleClient: boolean;
  interne: boolean;
}

export const TEMPLATE_JUMELE: TemplateEtape[] = [
  { nom: 'Excavation', jours: 3, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Fondations', jours: 5, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Charpente', jours: 10, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Mur extérieur', jours: 5, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Plombier fond de cave', jours: 2, assigneA: 'Plomberie Côté', visibleClient: false, interne: true },
  { nom: 'Couler plancher intérieur', jours: 1, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Intérieur division', jours: 3, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Installation foyer', jours: 2, assigneA: null, visibleClient: false, interne: true },
  { nom: 'Intérieur division (2)', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Mesure armoire', jours: 1, assigneA: 'Cuisines Beauce', visibleClient: true, interne: false },
  { nom: 'Air climatisé', jours: 1, assigneA: 'Ventil. Express', visibleClient: true, interne: false },
  { nom: 'Électricien + TV & Tél', jours: 2, assigneA: 'Élec. Vachon', visibleClient: true, interne: false },
  { nom: 'Plombier', jours: 1, assigneA: 'Plomberie Côté', visibleClient: true, interne: false },
  { nom: 'Échangeur d\'air', jours: 1, assigneA: 'Ventil. Express', visibleClient: true, interne: false },
  { nom: 'Isolation entretoit', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Mesure finition', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Final menuiserie', jours: 2, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Entrée gypse', jours: 1, assigneA: 'Gypse Beauce', visibleClient: true, interne: false },
  { nom: 'Pose gypse', jours: 3, assigneA: 'Gypse Beauce', visibleClient: true, interne: false },
  { nom: 'Tireur de joints', jours: 5, assigneA: 'Gypse Beauce', visibleClient: true, interne: false },
  { nom: 'Entrée finition', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Pose finition', jours: 3, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Peinture', jours: 3, assigneA: 'Peinture Martin', visibleClient: true, interne: false },
  { nom: 'Livraison céramique', jours: 1, assigneA: 'Céramique Plus', visibleClient: true, interne: false },
  { nom: 'Pose céramique', jours: 2, assigneA: 'Céramique Plus', visibleClient: true, interne: false },
  { nom: 'Coulis', jours: 1, assigneA: 'Céramique Plus', visibleClient: true, interne: false },
  { nom: 'Livraison armoire', jours: 1, assigneA: 'Cuisines Beauce', visibleClient: true, interne: false },
  { nom: 'Pose armoire', jours: 1, assigneA: 'Cuisines Beauce', visibleClient: true, interne: false },
  { nom: 'Dosseret', jours: 1, assigneA: 'Cuisines Beauce', visibleClient: true, interne: false },
  { nom: 'Livraison fixture', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Finition électrique + TV & Tél', jours: 1, assigneA: 'Élec. Vachon', visibleClient: true, interne: false },
  { nom: 'Finition plomberie', jours: 1, assigneA: 'Plomberie Côté', visibleClient: true, interne: false },
  { nom: 'Finition échangeur d\'air', jours: 1, assigneA: 'Ventil. Express', visibleClient: true, interne: false },
  { nom: 'Air climatisé final', jours: 1, assigneA: 'Ventil. Express', visibleClient: true, interne: false },
  { nom: 'Installation porte de douche', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Pose escalier ou rampe', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Pose plancher', jours: 2, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Petite finition', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Peinture finale', jours: 2, assigneA: 'Peinture Martin', visibleClient: true, interne: false },
  { nom: 'Pose miroir + tablettes', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Service +', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Pose tapis', jours: 1, assigneA: null, visibleClient: true, interne: false },
  { nom: 'Ménage', jours: 1, assigneA: null, visibleClient: true, interne: false },
];

export const TEMPLATE_MAISON: TemplateEtape[] = TEMPLATE_JUMELE; // Même template pour maison et jumelé
