import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { generateCedulePDF } from '@/lib/pdf-generator';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Le paramètre 'id' est maintenant un slug - chercher par slug d'abord
    let projet = await prisma.projet.findUnique({
      where: { slug: id },
      include: {
        client: true,
        taches: { orderBy: { ordre: 'asc' } },
      },
    });

    // Fallback: chercher par UUID en cas d'ancienne URL
    if (!projet) {
      projet = await prisma.projet.findUnique({
        where: { id },
        include: {
          client: true,
          taches: { orderBy: { ordre: 'asc' } },
        },
      });
    }

    if (!projet) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    // Charger l'image en base64
    let logoBase64 = '';
    try {
      const logoPath = join(process.cwd(), 'public', 'habitationsdg.png');
      const logoBuffer = readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
      console.error('Logo non trouvé:', err);
    }

    // Générer le PDF
    const pdfBuffer = await renderToBuffer(generateCedulePDF(projet, logoBase64));

    // Retourner le PDF avec les headers appropriés
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cedule-${projet.adresse.replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
