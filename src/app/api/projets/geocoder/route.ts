import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { geocoderAdresse } from '@/lib/geocoding';

export async function GET() {
  try {
    const projets = await prisma.projet.findMany({
      where: { latitude: null }
    });

    const results = [];
    for (const projet of projets) {
      // Délai de 1.1 secondes entre chaque requête (limite Nominatim)
      await new Promise(r => setTimeout(r, 1100));
      const coords = await geocoderAdresse(projet.adresse, projet.ville);
      if (coords) {
        await prisma.projet.update({
          where: { id: projet.id },
          data: { latitude: coords.lat, longitude: coords.lng }
        });
        results.push({ id: projet.id, adresse: projet.adresse, ...coords });
      }
    }

    return NextResponse.json({ geocoded: results.length, results });
  } catch (error: any) {
    console.error('Erreur géocodage:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
