export default function PaiementsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Paiements - Projet {params.id}</h1>
      {/* Gestion des paiements à ajouter */}
    </div>
  );
}
