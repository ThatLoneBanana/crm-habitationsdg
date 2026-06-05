import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Test Prisma Connection');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ NOT LOADED');
    console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ Loaded' : '❌ NOT LOADED');

    // Essayer une requête simple
    const userCount = await prisma.user.count();
    const projetCount = await prisma.projet.count();

    return NextResponse.json({
      status: 'success',
      message: 'Prisma connection OK',
      data: {
        databaseUrl: process.env.DATABASE_URL ? 'Loaded' : 'NOT_LOADED',
        users: userCount,
        projets: projetCount,
      },
    });
  } catch (error: any) {
    console.error('❌ Prisma Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        details: {
          databaseUrl: process.env.DATABASE_URL ? 'Loaded' : 'NOT_LOADED',
          error: error.toString(),
        },
      },
      { status: 500 }
    );
  }
}
