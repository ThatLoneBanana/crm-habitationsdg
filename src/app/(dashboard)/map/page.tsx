import { prisma } from '@/lib/prisma';
import MapView from '@/components/map/MapView';

export default async function MapPage() {
  const projetsPrisma = await prisma.projet.findMany({
    where: { latitude: { not: null } },
    include: {
      client: true,
      taches: { select: { dateDebut: true, dateFin: true } }
    },
    orderBy: { dateLivraison: 'asc' },
  });

  // Convertir les Decimal et calculer l'avancement depuis les tâches
  const projets = projetsPrisma.map(p => {
    const aujourd_hui = new Date();
    const tachesTerminees = p.taches.filter(t => t.dateFin && new Date(t.dateFin) < aujourd_hui).length;
    const avancement = p.taches.length > 0
      ? Math.round((tachesTerminees / p.taches.length) * 100)
      : 0;

    return {
      ...p,
      montantTotal: p.montantTotal ? parseFloat(p.montantTotal.toString()) : null,
      avancement,
      taches: undefined // pas besoin d'envoyer toutes les taches au client
    };
  });

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <MapView projets={projets} />
    </div>
  );
}
