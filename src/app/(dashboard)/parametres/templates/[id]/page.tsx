'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Trash2, Plus, GripVertical } from 'lucide-react';
import { subJoursOuvrables, addJoursOuvrables, countJoursOuvrables } from '@/lib/template-utils';

interface TemplateEtape {
  id: string;
  nom: string;
  ordre: number;
  joursDefaut: number;
  assigneA?: string;
  visibleClient: boolean;
  interne: boolean;
}

interface Template {
  id: string;
  nom: string;
  type: string;
  etapes: TemplateEtape[];
}

export default function TemplateEditPage({ params: paramPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramPromise);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateLivraison, setDateLivraison] = useState('');
  const [saving, setSaving] = useState(false);

  // Étape 1: édition étapes avec réordonnement
  const [etapes, setEtapes] = useState<TemplateEtape[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Étape 2: calcul des dates
  const [etapesAvecDates, setEtapesAvecDates] = useState<(TemplateEtape & { dateDebut?: Date; dateFin?: Date; buffer: number })[]>([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${params.id}`);
        if (!res.ok) throw new Error('Template non trouvé');
        const data = await res.json();
        setTemplate(data.template);
        setEtapes(data.template.etapes);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params.id]);

  // Calculer les dates quand dateLivraison change
  useEffect(() => {
    if (!dateLivraison || step !== 2) return;

    const livraison = new Date(dateLivraison);
    let cursor = new Date(livraison);

    const calculated = [...etapes]
      .reverse()
      .map(e => {
        const buffer = 0;
        if (buffer > 0) cursor = subJoursOuvrables(cursor, buffer);
        const dateFin = new Date(cursor);
        const dateDebut = e.joursDefaut <= 1
          ? new Date(cursor)
          : subJoursOuvrables(cursor, e.joursDefaut - 1);
        cursor = subJoursOuvrables(dateDebut, 1);
        return { ...e, dateDebut, dateFin, buffer };
      })
      .reverse();

    setEtapesAvecDates(calculated);
  }, [dateLivraison, step, etapes]);

  const handleDragStart = (idx: number) => setDraggedItem(idx);
  const handleDragOver = (idx: number) => {
    if (draggedItem === null || draggedItem === idx) return;
    const newEtapes = [...etapes];
    const temp = newEtapes[draggedItem];
    newEtapes[draggedItem] = newEtapes[idx];
    newEtapes[idx] = temp;
    setEtapes(newEtapes);
    setDraggedItem(idx);
  };

  const handleDeleteEtape = (idx: number) => {
    setEtapes(etapes.filter((_, i) => i !== idx));
  };

  const handleAddEtape = () => {
    const newEtape: TemplateEtape = {
      id: `new-${Date.now()}`,
      nom: 'Nouvelle étape',
      ordre: etapes.length + 1,
      joursDefaut: 1,
      visibleClient: true,
      interne: false,
    };
    setEtapes([...etapes, newEtape]);
  };

  const handleUpdateEtape = (idx: number, field: string, value: any) => {
    const newEtapes = [...etapes];
    newEtapes[idx] = { ...newEtapes[idx], [field]: value };
    setEtapes(newEtapes);
  };

  const handleSave = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!dateLivraison) {
      alert('Veuillez sélectionner une date de livraison');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapes }),
      });

      if (!res.ok) throw new Error('Erreur sauvegarde');
      router.push('/parametres/templates');
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  if (!template) {
    return <div className="p-8 text-center text-gray-500">Template non trouvé</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => step > 1 && setStep(step - 1)} className="p-1 hover:bg-gray-100 rounded">
          {step > 1 && '←'}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Éditer: {template.nom}</h1>
      </div>

      <div className="flex gap-4 mb-12">
        {[1, 2].map(s => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full ${s < step ? 'bg-green-500' : s === step ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <p className="text-xs text-gray-600 mt-2 font-medium">{s === 1 ? 'Étapes' : 'Dates'}</p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Étape 1: Confirmez et réordonnez les étapes — glissez pour réorganiser
            </p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {etapes.map((etape, idx) => (
              <div
                key={etape.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={() => handleDragOver(idx)}
                onDrop={() => setDraggedItem(null)}
                className={`flex items-center gap-3 p-3 border rounded-lg bg-white cursor-move ${
                  draggedItem === idx ? 'opacity-50' : ''
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 w-8">{idx + 1}.</span>
                <Input
                  value={etape.nom}
                  onChange={(e) => handleUpdateEtape(idx, 'nom', e.target.value)}
                  className="flex-1"
                />
                <input
                  type="checkbox"
                  checked={etape.visibleClient}
                  onChange={(e) => handleUpdateEtape(idx, 'visibleClient', e.target.checked)}
                  className="w-4 h-4"
                  title="Visible client"
                />
                <button onClick={() => handleDeleteEtape(idx)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button onClick={handleAddEtape} variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Ajouter une étape
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="livraison">Date de livraison *</Label>
            <Input
              id="livraison"
              type="date"
              value={dateLivraison}
              onChange={(e) => setDateLivraison(e.target.value)}
              className="mt-2"
            />
          </div>

          {dateLivraison && (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-3 py-2 text-left font-semibold">N°</th>
                    <th className="px-3 py-2 text-left font-semibold">Étape</th>
                    <th className="px-3 py-2 text-left font-semibold">Jours</th>
                    <th className="px-3 py-2 text-left font-semibold">Début</th>
                    <th className="px-3 py-2 text-left font-semibold">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {etapesAvecDates.map((e, idx) => (
                    <tr key={e.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium">{e.nom}</td>
                      <td className="px-3 py-2">{e.joursDefaut}j</td>
                      <td className="px-3 py-2 text-xs">{e.dateDebut?.toLocaleDateString('fr-CA')}</td>
                      <td className="px-3 py-2 text-xs">{e.dateFin?.toLocaleDateString('fr-CA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 mt-12">
        <Button variant="outline" onClick={() => router.push('/parametres/templates')} className="flex-1">
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
          {step === 1 ? (
            <>
              Continuer
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            saving ? 'Sauvegarde...' : 'Valider la cédule'
          )}
        </Button>
      </div>
    </div>
  );
}
