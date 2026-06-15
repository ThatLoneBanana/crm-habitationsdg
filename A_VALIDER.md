# À VALIDER — Ronde de vérification locale

Checklist des éléments développés en remote (sans test runtime) à valider sur `localhost:3000` avant déploiement. Cocher au fur et à mesure.

> Contexte : le travail a été fait en remote avec validation par `tsc` + `build` uniquement. Cette ronde confirme le comportement réel en navigateur, connecté.

---

## 🔴 PRIORITÉ SÉCURITÉ (à ne pas reporter au-delà du déploiement)

- [ ] **Vue client publique — fuite de données.** Ouvrir `/p/<slug>` en navigation privée (déconnecté). Ouvrir l'inspecteur réseau, regarder la réponse de `/api/projets-by-slug`. Confirmer que le JSON ne contient **aucune** donnée financière (montant total, marges), aucune étape interne (`visibleClient=false`), aucun extra non signé, ni vendeur/chargé de projet. Seules données attendues : adresse/ville/livraison, contact client, étapes visibles client, échéancier de paiement, identité d'entreprise publique.

## 🟢 Fonctionnalités câblées (Catégorie 1)

- [ ] **Extras — ajouter.** Créer un extra sur un projet → recharger → l'extra persiste.
- [ ] **Extras — signer.** Signer un extra → passe à « Signé » avec date.
- [ ] **Clients — modifier.** Modifier un client → persiste.
- [ ] **Clients — supprimer (lié).** Supprimer un client lié à un projet → alerte 409 claire, pas de crash.
- [ ] **Clients — supprimer (libre).** Supprimer un client sans projet → OK.
- [ ] **Liste projets — corbeille 🗑.** Supprimer depuis la liste → confirmation demandée → supprime.
- [ ] **Vue client — chargement anonyme.** Le lien `/p/<slug>` charge bien pour un visiteur non connecté.

## 🚧 États « en développement » (Catégorie 2) — ne doivent plus planter

- [ ] **GCR** (onglet projet) → état « en développement » propre, pas de crash 500.
- [ ] **Journal d'activité** (`/parametres/logs`) → état « en développement », pas de crash 500.
- [ ] **Documents** (onglet projet) → état vide propre, aucune dropzone factice.

## ⛔ Boutons désactivés (Catégorie 2) — grisés + tooltip « bientôt »

- [ ] Paiements « Ajouter un paiement » → grisé, ne fait rien au clic.
- [ ] Cédule « Supprimer une étape » → plus d'alerte « non implémenté ».
- [ ] « Envoyer au client » → grisé, plus d'alerte « en implémentation ».

## 🎨 Micro-fixes visuels (à grouper dans une passe polish)

- [ ] Dashboard : mois capitalisé « Lun 15 Juin » → « juin » (minuscule, convention québécoise).

---

## Alignements visuels REF (validation différée, en lot)

- [ ] Dashboard ✓ (déjà validé)
- [ ] Page projet — en-tête + Gantt ✓ (déjà validé)
- [ ] Page projet — onglets Extras / Paiements / Documents
- [ ] ProjetsList
- [ ] (à compléter au fil des prochaines sessions)
