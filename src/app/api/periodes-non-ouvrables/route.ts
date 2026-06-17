import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Périodes non ouvrables GLOBALES (vacances, fériés, shutdowns). Auth assurée
// par le proxy (route non publique). Cohérent avec /api/parametres.

export async function GET() {
  try {
    const periodes = await prisma.periodeNonOuvrable.findMany({ orderBy: { dateDebut: 'asc' } });
    return NextResponse.json({ periodes });
  } catch (error: any) {
    console.error('Erreur API périodes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, dateDebut, dateFin } = body;
    if (!nom || !dateDebut || !dateFin) {
      return NextResponse.json({ error: 'nom, dateDebut et dateFin sont requis' }, { status: 400 });
    }
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }
    if (fin < debut) {
      return NextResponse.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 });
    }
    const periode = await prisma.periodeNonOuvrable.create({ data: { nom, dateDebut: debut, dateFin: fin } });
    return NextResponse.json({ periode }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création période:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
