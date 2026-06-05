import { Projet, Client, User, Tache, Extra, Paiement, Fournisseur } from '@prisma/client';

export type {
  Projet,
  Client,
  User,
  Tache,
  Extra,
  Paiement,
  Fournisseur,
};

export interface ProjetWithRelations extends Projet {
  client: Client;
  vendeur: User | null;
  chargeProjet: User | null;
  taches: Tache[];
  extras: Extra[];
  paiements: Paiement[];
}
