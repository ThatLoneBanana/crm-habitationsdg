'use client';

import { useState } from 'react';
import { Extra } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExtraDialog } from './extra-dialog';
import { formatCurrency } from '@/lib/utils';
import { Plus, Check, Clock, CheckCircle, Edit2 } from 'lucide-react';

interface ExtrasTabProps {
  extras: Extra[];
  projectId: string;
}

const statutColors: Record<string, { bg: string; text: string; icon: any }> = {
  EN_ATTENTE: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    icon: Clock,
  },
  SIGNE: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: Check,
  },
  REFUSE: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    icon: null,
  },
};

export function ExtrasTab({ extras, projectId }: ExtrasTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<any>(null);

  const handleAddExtra = () => {
    setSelectedExtra(null);
    setDialogOpen(true);
  };

  const handleEditExtra = (extra: Extra) => {
    setSelectedExtra(extra);
    setDialogOpen(true);
  };

  const handleSignExtra = async (extra: Extra) => {
    console.log('Signer extra:', extra.id);
    // TODO: Implémenter l'API pour signer l'extra
  };

  const handleSaveExtra = async (data: any) => {
    console.log('Sauvegarder extra:', data);
    // TODO: Implémenter l'API pour créer/mettre à jour un extra
    setDialogOpen(false);
  };
  const totalSignes = extras
    .filter((e) => e.statut === 'SIGNE')
    .reduce((sum, e) => sum + e.montant, 0);

  const totalEnAttente = extras
    .filter((e) => e.statut === 'EN_ATTENTE')
    .reduce((sum, e) => sum + e.montant, 0);

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-700 mb-1">Extras signés</p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(totalSignes)}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-700 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-900">
            {formatCurrency(totalEnAttente)}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 mb-1">Total potentiel</p>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(totalSignes + totalEnAttente)}
          </p>
        </div>
      </div>

      {/* Bouton Ajouter */}
      <div className="flex justify-end">
        <Button onClick={handleAddExtra} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Ajouter un extra
        </Button>
      </div>

      {/* Liste des extras */}
      <div className="space-y-3">
        {extras.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun extra défini</p>
          </div>
        ) : (
          extras.map((extra) => {
            const config = statutColors[extra.statut];
            return (
              <div
                key={extra.id}
                className={`p-4 border rounded-lg ${config.bg}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {extra.description}
                      </h4>
                      <Badge className={`${config.text} bg-white border`}>
                        {extra.statut === 'EN_ATTENTE'
                          ? 'En attente'
                          : extra.statut === 'SIGNE'
                            ? 'Signé'
                            : 'Refusé'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {extra.fournisseur && (
                        <span>Fournisseur: {extra.fournisseur}</span>
                      )}
                      {extra.signeLe && (
                        <span>
                          Signé le:{' '}
                          {new Date(extra.signeLe).toLocaleDateString('fr-CA')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(extra.montant)}
                    </p>
                    <div className="flex gap-2 justify-end">
                      {extra.statut === 'EN_ATTENTE' && (
                        <Button
                          size="sm"
                          onClick={() => handleSignExtra(extra)}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Signer
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExtra(extra)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog Ajouter/Éditer extra */}
      <ExtraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        extra={selectedExtra}
        onSave={handleSaveExtra}
      />
    </div>
  );
}
