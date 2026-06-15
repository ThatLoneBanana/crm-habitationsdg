import { ProjetWithRelations } from '@/types';
import Link from 'next/link';

interface ProjetCardProps {
  projet: ProjetWithRelations;
}

export function ProjetCard({ projet }: ProjetCardProps) {
  return (
    <Link href={`/projets/${projet.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-lg mb-2">{projet.adresse}</h3>
        <p className="text-gray-600 text-sm mb-2">{projet.ville}</p>
        <div className="flex justify-between items-end">
          <div className="text-xs">
            <span className="text-gray-500">Client: </span>
            <span className="font-medium">{projet.client.nom}</span>
          </div>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {projet.phase}
          </span>
        </div>
      </div>
    </Link>
  );
}
