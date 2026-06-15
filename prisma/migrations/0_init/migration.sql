-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COMPTABILITE', 'VENDEUR', 'CHARGE_PROJET', 'DEVELOPPEUR');

-- CreateEnum
CREATE TYPE "TypeContrat" AS ENUM ('PRELIMINAIRE', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "TypeProjet" AS ENUM ('JUMELE', 'MAISON', 'MULTILOGEMENT');

-- CreateEnum
CREATE TYPE "PhaseProjet" AS ENUM ('SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE');

-- CreateEnum
CREATE TYPE "StatutTache" AS ENUM ('NON_COMMENCE', 'CONFIRME', 'EN_COURS', 'COMPLETE', 'DECALE');

-- CreateEnum
CREATE TYPE "StatutExtra" AS ENUM ('EN_ATTENTE', 'SIGNE', 'REFUSE');

-- CreateEnum
CREATE TYPE "CategorieDepense" AS ENUM ('MATERIAUX', 'SOUS_TRAITANT', 'MAIN_OEUVRE', 'EQUIPEMENT', 'AUTRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "tauxHoraire" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projet" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "typeProjet" "TypeProjet" NOT NULL,
    "typeContrat" "TypeContrat" NOT NULL,
    "phase" "PhaseProjet" NOT NULL DEFAULT 'SIGNE',
    "dateContrat" TIMESTAMP(3),
    "dateLivraison" TIMESTAMP(3),
    "montantTotal" DECIMAL(12,2),
    "toleranceJours" INTEGER NOT NULL DEFAULT 3,
    "slug" TEXT,
    "urlClient" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "clientId" TEXT NOT NULL,
    "vendeurId" TEXT,
    "chargeProjetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tache" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "ordre" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "dureeJours" INTEGER NOT NULL DEFAULT 1,
    "statut" "StatutTache" NOT NULL DEFAULT 'NON_COMMENCE',
    "visibleClient" BOOLEAN NOT NULL DEFAULT false,
    "interne" BOOLEAN NOT NULL DEFAULT false,
    "assigneA" TEXT,
    "buffer" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extra" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "fournisseur" TEXT,
    "statut" "StatutExtra" NOT NULL DEFAULT 'EN_ATTENTE',
    "signeLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Extra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "pourcentage" DOUBLE PRECISION,
    "recu" BOOLEAN NOT NULL DEFAULT false,
    "datePrevu" TIMESTAMP(3),
    "dateRecu" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "metier" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetFournisseur" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "fournisseurId" TEXT NOT NULL,
    "budgetAlloue" DOUBLE PRECISION,
    "confirme" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjetFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeProjet" NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateEtape" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "joursDefaut" INTEGER NOT NULL,
    "assigneA" TEXT,
    "visibleClient" BOOLEAN NOT NULL DEFAULT true,
    "interne" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateEtape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametres" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "nomCompagnie" TEXT NOT NULL DEFAULT 'Habitations DG',
    "rbq" TEXT NOT NULL DEFAULT '5856-1036-01',
    "email" TEXT NOT NULL DEFAULT 'info@habitations-dg.com',
    "telephone" TEXT NOT NULL DEFAULT '',
    "siteWeb" TEXT NOT NULL DEFAULT 'habitations-dg.com',
    "maxHeuresParSemaine" DOUBLE PRECISION NOT NULL DEFAULT 36.5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parametres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employe" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "tauxHoraire" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metier" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeuilleTemps" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "employeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heures" DOUBLE PRECISION NOT NULL,
    "tauxHoraire" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "approuve" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeuilleTemps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depense" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "categorie" "CategorieDepense" NOT NULL,
    "description" TEXT NOT NULL,
    "fournisseur" TEXT,
    "montant" DOUBLE PRECISION NOT NULL,
    "dateDepense" TIMESTAMP(3) NOT NULL,
    "facture" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "permissions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Projet_numero_key" ON "Projet"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Projet_slug_key" ON "Projet"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateEtape_templateId_ordre_key" ON "TemplateEtape"("templateId", "ordre");

-- CreateIndex
CREATE INDEX "FeuilleTemps_projetId_idx" ON "FeuilleTemps"("projetId");

-- CreateIndex
CREATE INDEX "FeuilleTemps_employeId_idx" ON "FeuilleTemps"("employeId");

-- CreateIndex
CREATE INDEX "Depense_projetId_idx" ON "Depense"("projetId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_key" ON "RolePermission"("role");

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_vendeurId_fkey" FOREIGN KEY ("vendeurId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_chargeProjetId_fkey" FOREIGN KEY ("chargeProjetId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetFournisseur" ADD CONSTRAINT "ProjetFournisseur_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateEtape" ADD CONSTRAINT "TemplateEtape_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeuilleTemps" ADD CONSTRAINT "FeuilleTemps_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeuilleTemps" ADD CONSTRAINT "FeuilleTemps_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

