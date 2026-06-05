export default function CedulePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Cédule - Projet {params.id}</h1>
      {/* Cédule/timeline à ajouter */}
    </div>
  );
}
