export default function ExtrasPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Extras - Projet {params.id}</h1>
      {/* Liste des extras à ajouter */}
    </div>
  );
}
