import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projetId = searchParams.get('projetId');

    if (!projetId) {
      return NextResponse.json({ error: 'projetId manquant' }, { status: 400 });
    }

    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
      include: {
        client: true,
        taches: { orderBy: { ordre: 'asc' } },
      },
    });

    if (!projet) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    const html = genererHTML(projet);
    return NextResponse.json({ html });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function genererHTML(projet: any) {
  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-CA');
  };

  const taches = projet.taches.map((t: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 120px;">${formatDate(t.dateDebut)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.nom}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-item { font-size: 12px; line-height: 1.6; }
        .info-label { color: #666; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 11px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Habitations DG</div>
        <div style="font-size: 12px; color: #666;">RBQ: 5856-1036-01</div>
      </div>

      <div class="info">
        <div class="info-item">
          <div class="info-label">Client</div>
          <div>${projet.client.prenom} ${projet.client.nom}</div>
          <div style="font-size: 11px; margin-top: 5px;">${projet.client.email}</div>
          <div style="font-size: 11px;">${projet.client.telephone || ''}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Adresse</div>
          <div>${projet.adresse}, ${projet.ville}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date de livraison</div>
          <div>${new Date(projet.dateLivraison).toLocaleDateString('fr-CA')}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Mise à jour</div>
          <div>${new Date().toLocaleDateString('fr-CA')}</div>
        </div>
      </div>

      <h3 style="margin-top: 30px;">Description des travaux</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 120px;">Date prévue</th>
            <th>Description des travaux</th>
          </tr>
        </thead>
        <tbody>
          ${taches}
        </tbody>
      </table>

      <div class="footer">
        <p>Habitations DG — RBQ: 5856-1036-01</p>
      </div>
    </body>
    </html>
  `;
}
