import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NotesPanel } from '@/components/notes/notes-panel';

// Destination Notes (bottombar mobile, aussi accessible par URL). Même lecture
// que le panneau du dashboard : notes de l'utilisateur courant + liste courte
// des projets actifs pour le tag. Réutilise l'API /api/notes existante.
export default async function NotesPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const [notesData, projetsData] = await Promise.all([
    prisma.note.findMany({
      where: { userId: user.id },
      orderBy: [{ fait: 'asc' }, { createdAt: 'desc' }],
      include: { projet: { select: { id: true, adresse: true, ville: true } } },
    }),
    prisma.projet.findMany({
      where: { phase: { not: 'TERMINE' } },
      select: { id: true, adresse: true, ville: true },
      orderBy: { dateLivraison: 'asc' },
    }),
  ]);

  const notes = JSON.parse(JSON.stringify(notesData));
  const projetsPourTag = JSON.parse(JSON.stringify(projetsData));

  return (
    <div style={{ padding: '22px 24px 40px', maxWidth: 520, margin: '0 auto' }}>
      <NotesPanel notesInitiales={notes} projets={projetsPourTag} />
    </div>
  );
}
