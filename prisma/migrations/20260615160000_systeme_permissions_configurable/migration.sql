-- CreateTable
CREATE TABLE "RolePermission" (
    "role" "Role" NOT NULL,
    "voirCosting" BOOLEAN NOT NULL DEFAULT false,
    "voirFeuilles" BOOLEAN NOT NULL DEFAULT false,
    "editFeuilles" BOOLEAN NOT NULL DEFAULT false,
    "voirGCR" BOOLEAN NOT NULL DEFAULT false,
    "editCedule" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role")
);

-- Seed des défauts métier (idempotent : ne réécrit pas une config existante).
-- ADMIN/DEVELOPPEUR volontairement absents (accès total géré en dur).
INSERT INTO "RolePermission" ("role", "voirCosting", "voirFeuilles", "editFeuilles", "voirGCR", "editCedule", "updatedAt") VALUES
  ('COMPTABILITE', true, true, true, true, false, NOW()),
  ('CHARGE_PROJET', false, false, false, true, true, NOW()),
  ('VENDEUR', false, false, false, false, false, NOW())
ON CONFLICT ("role") DO NOTHING;
