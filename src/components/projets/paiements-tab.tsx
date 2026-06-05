'use client';

import { useState } from 'react';
import { Paiement } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Check, Clock, X } from 'lucide-react';

interface PaiementsTabProps {
  paiements: Paiement[];
  typeContrat: string;
  projectId: string;
}

export function PaiementsTab({
  paiements: initialPaiements,
  typeContrat,
  projectId,
}: PaiementsTabProps) {
  const [paiements, setPaiements] = useState(initialPaiements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateRecu, setDateRecu] = useState('');

  const handleMarkAsReceived = async (paiement: Paiement) => {
    const date = dateRecu || new Date().toISOString().split('T')[0];
    try {
      const res = await fetch('/api/paiements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paiement.id, recu: true, dateRecu: date }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setPaiements(
        paiements.map((p) =>
          p.id === paiement.id
            ? { ...p, recu: true, dateRecu: new Date(date) }
            : p
        )
      );
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
    setEditingId(null);
    setDateRecu('');
  };

  const handleMarkAsNotReceived = async (paiement: Paiement) => {
    try {
      const res = await fetch('/api/paiements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paiement.id, recu: false, dateRecu: null }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setPaiements(
        paiements.map((p) =>
          p.id === paiement.id
            ? { ...p, recu: false, dateRecu: null }
            : p
        )
      );
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const totalPlanifie = paiements.reduce((sum, p) => sum + p.montant, 0);
  const totalRecu = paiements
    .filter((p) => p.recu)
    .reduce((sum, p) => sum + p.montant, 0);
  const totalEnAttente = paiements
    .filter((p) => !p.recu)
    .reduce((sum, p) => sum + p.montant, 0);

  const paiementsEnRetard = paiements.filter(
    (p) => !p.recu && p.datePrevu && new Date(p.datePrevu) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-700 mb-1">Reçus</p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(totalRecu)}
          </p>
          <p className="text-xs text-green-600 mt-2">
            {(totalPlanifie > 0 ? (totalRecu / totalPlanifie) * 100 : 0).toFixed(0)}
            %
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-700 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-900">
            {formatCurrency(totalEnAttente)}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 mb-1">Total planifié</p>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(totalPlanifie)}
          </p>
        </div>
      </div>

      {/* Alerte si en retard */}
      {paiementsEnRetard.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-800">
            ⚠️ {paiementsEnRetard.length} paiement(s) en retard
          </p>
          <p className="text-xs text-red-700 mt-1">
            Montant: {formatCurrency(
              paiementsEnRetard.reduce((sum, p) => sum + p.montant, 0)
            )}
          </p>
        </div>
      )}

      {/* Bouton Ajouter */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Ajouter un paiement
        </Button>
      </div>

      {/* Liste des paiements */}
      <div className="space-y-3">
        {paiements.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun paiement défini</p>
          </div>
        ) : (
          paiements.map((paiement) => (
            <div
              key={paiement.id}
              className={`p-4 border rounded-lg ${
                paiement.recu ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {paiement.description}
                    </h4>
                    <Badge
                      className={
                        paiement.recu
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {paiement.recu ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Reçu
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          En attente
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {paiement.pourcentage && (
                      <span>{paiement.pourcentage}% du prix</span>
                    )}
                    {paiement.datePrevu && (
                      <span>
                        Prévu:{' '}
                        {formatDate(paiement.datePrevu)}
                      </span>
                    )}
                    {paiement.dateRecu && (
                      <span className="text-green-600">
                        Reçu: {formatDate(paiement.dateRecu)}
                      </span>
                    )}
                  </div>

                  {/* Formulaire inline pour marquer comme reçu */}
                  {editingId === paiement.id && !paiement.recu && (
                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        type="date"
                        value={dateRecu}
                        onChange={(e) => setDateRecu(e.target.value)}
                        className="w-40"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsReceived(paiement)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(paiement.montant)}
                  </p>
                  {paiement.recu ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsNotReceived(paiement)}
                    >
                      Annuler reçu
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingId(paiement.id);
                        setDateRecu(new Date().toISOString().split('T')[0]);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marquer reçu
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info type contrat */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="text-blue-900 font-medium">
          Type de contrat: {typeContrat === 'PRELIMINAIRE' ? 'Préliminaire' : 'Entreprise'}
        </p>
        <p className="text-blue-700 text-xs mt-2">
          {typeContrat === 'PRELIMINAIRE'
            ? 'Plan de paiements selon le calendrier établi'
            : 'Plan de paiements selon les conditions du contrat'}
        </p>
      </div>
    </div>
  );
}
