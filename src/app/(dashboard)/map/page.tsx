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
    <div className="h-[calc(100vh_-_56px)] md:h-screen" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* En-tête (REF Carte) */}
      <div style={{ padding: '18px 24px 14px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Carte des chantiers</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{projets.length} projets en Chaudière-Appalaches</p>
      </div>
      {/* Conteneur carte bordé */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, margin: '0 24px 24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <MapView projets={projets} />
      </div>
    </div>
  );
}
