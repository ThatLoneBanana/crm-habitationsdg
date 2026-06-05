import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

// Créer ou réutiliser l'instance Prisma
// En développement, vérifier que l'instance a tous les modèles nécessaires
let prismaInstance = globalForPrisma.prisma;

if (!prismaInstance) {
  prismaInstance = createPrismaClient();
} else if (process.env.NODE_ENV === 'development' && !('template' in prismaInstance)) {
  // Si l'instance n'a pas le modèle template, créer une nouvelle instance
  prismaInstance = createPrismaClient();
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
