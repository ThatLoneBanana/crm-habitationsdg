'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { ProjetWithRelations } from '@/types';

interface ProjetsTableProps {
  projets: ProjetWithRelations[];
}

const phaseColors: Record<string, string> = {
  SIGNE: 'bg-blue-100 text-blue-800',
  VENTE: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-purple-100 text-purple-800',
  PREPARATION: 'bg-yellow-100 text-yellow-800',
  CHANTIER: 'bg-orange-100 text-orange-800',
  LIVRAISON: 'bg-green-100 text-green-800',
  CLOTURE: 'bg-gray-100 text-gray-800',
};

const phaseLabels: Record<string, string> = {
  SIGNE: 'Signé',
  VENTE: 'Vente',
  ADMIN: 'Admin',
  PREPARATION: 'Préparation',
  CHANTIER: 'Chantier',
  LIVRAISON: 'Livraison',
  CLOTURE: 'Clôturé',
};

const getPhaseColor = (phase: string | null | undefined) => phaseColors[phase || 'SIGNE'] || phaseColors['SIGNE'];
const getPhaseLabel = (phase: string | null | undefined) => phaseLabels[phase || 'SIGNE'] || phaseLabels['SIGNE'];

export function ProjetsTable({ projets }: ProjetsTableProps) {
  const getJoursRestants = (dateLivraison: Date | string | null) => {
    if (!dateLivraison) return null;
    const now = new Date();
    const date = typeof dateLivraison === 'string' ? new Date(dateLivraison) : dateLivraison;
    const jours = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return jours;
  };

  const getUrgenceColor = (jours: number | null) => {
    if (jours === null) return 'text-gray-500';
    if (jours < 0) return 'text-red-600 font-bold';
    if (jours < 14) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  const calculAvancement = (projet: any) => {
    // Utiliser l'avancement retourné par l'API (basé sur les dates)
    if (projet.avancement !== undefined) {
      return projet.avancement;
    }
    // Fallback: calculer par statut si avancement non disponible
    if (projet.taches.length === 0) return 0;
    const tachesCompletes = projet.taches.filter(
      (t: any) => t.statut === 'COMPLETE'
    ).length;
    return Math.round((tachesCompletes / projet.taches.length) * 100);
  };

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-50">
            <TableHead className="font-semibold">Client / Adresse</TableHead>
            <TableHead className="font-semibold">Phase</TableHead>
            <TableHead className="font-semibold">Avancement</TableHead>
            <TableHead className="font-semibold">Livraison</TableHead>
            <TableHead className="font-semibold">Type contrat</TableHead>
            <TableHead className="font-semibold">Vendeur</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Aucun projet trouvé
              </TableCell>
            </TableRow>
          ) : (
            projets.map((projet) => {
              const avancement = calculAvancement(projet);
              const joursRestants = getJoursRestants(projet.dateLivraison);

              return (
                <TableRow key={projet.id} className="hover:bg-gray-50 cursor-pointer">
                  {/* Client / Adresse */}
                  <TableCell className="cursor-pointer hover:underline">
                    <a href={`/projets/${projet.slug}`}>
                      <div>
                        <p className="font-medium text-sm text-gray-900 hover:text-gray-700">
                          {projet.adresse}, {projet.ville}
                        </p>
                        <p className="text-xs text-gray-500">
                          {projet.client.prenom} {projet.client.nom}
                        </p>
                      </div>
                    </a>
                  </TableCell>

                  {/* Phase */}
                  <TableCell>
                    <Badge className={getPhaseColor(projet.phase)}>
                      {getPhaseLabel(projet.phase)}
                    </Badge>
                  </TableCell>

                  {/* Avancement */}
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${avancement}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {avancement}%
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Livraison */}
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">
                        {formatDate(projet.dateLivraison)}
                      </p>
                      {joursRestants !== null && (
                        <p className={`text-xs ${getUrgenceColor(joursRestants)}`}>
                          {joursRestants < 0
                            ? `${Math.abs(joursRestants)} j. en retard`
                            : `${joursRestants} j. restants`}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Type contrat */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {projet.typeContrat === 'PRELIMINAIRE'
                        ? 'Préliminaire'
                        : 'Entreprise'}
                    </Badge>
                  </TableCell>

                  {/* Vendeur */}
                  <TableCell>
                    <p className="text-sm">
                      {projet.vendeur
                        ? `${projet.vendeur.prenom} ${projet.vendeur.nom}`
                        : '-'}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Voir"
                        onClick={() => window.location.href = `/projets/${projet.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Éditer"
                        onClick={() => window.location.href = `/projets/${projet.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-600"
                        title="Supprimer"
                        onClick={() => {
                          if (confirm(`Êtes-vous sûr de vouloir supprimer le projet ${projet.adresse}?`)) {
                            console.log('Supprimer projet:', projet.id);
                            // TODO: Appeler API de suppression
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
