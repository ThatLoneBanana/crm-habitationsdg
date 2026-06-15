-- AlterTable
ALTER TABLE "Parametres" ADD COLUMN     "margeCeduleJours" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "toleranceDefautJours" INTEGER NOT NULL DEFAULT 3;
