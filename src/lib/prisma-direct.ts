import { PrismaClient } from '@prisma/client';

// Connection directe avec hardcoded connection string
// (même approche que seed.ts qui fonctionne)
const connectionString = 'postgresql://postgres.luzqndarimdwkogjurxm:NicolasSR2026!@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

const globalForPrisma = global as unknown as { prismaDirect: PrismaClient };

export const prismaDirect =
  globalForPrisma.prismaDirect ||
  new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaDirect = prismaDirect;
