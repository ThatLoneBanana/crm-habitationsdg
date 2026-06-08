import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculerPhaseAutomatique } from '@/lib/phase-calculator';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const projet = await prisma.projet.findUnique({
      where: { id },
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: { orderBy: { ordre: 'asc' } },
        extras: true,
        paiements: true,
      },
    });

    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Calculer la phase automatiquement
    const nouvellePhase = calculerPhaseAutomatique(projet);

    // Si la phase a changé, mettre à jour en DB
    if (nouvellePhase !== projet.phase) {
      await prisma.projet.update({
        where: { id },
        data: { phase: nouvellePhase }
      });
      projet.phase = nouvellePhase;
    }

    return NextResponse.json({ projet });
  } catch (error: any) {
    console.error('Erreur API projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const projet = await prisma.projet.update({
      where: { id },
      data: {
        adresse: body.adresse,
        ville: body.ville,
        typeProjet: body.typeProjet,
        typeContrat: body.typeContrat,
        montantTotal: body.montantTotal,
        dateContrat: body.dateContrat ? new Date(body.dateContrat) : undefined,
        dateLivraison: body.dateLivraison ? new Date(body.dateLivraison) : undefined,
        phase: body.phase,
        vendeurId: body.vendeurId || null,
        chargeProjetId: body.chargeProjetId || null,
      },
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: true,
        extras: true,
        paiements: true,
      }
    });

    return NextResponse.json({ success: true, projet });
  } catch (error: any) {
    console.error('Erreur modification projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Vérifier que le projet existe
    const projet = await prisma.projet.findUnique({
      where: { id },
    });

    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le projet (cascade supprimes taches, paiements, extras, etc.)
    await prisma.projet.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
