'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight, CheckCircle } from 'lucide-react';

const CLIENTS = [
  { id: '1', nom: 'Gagné', prenom: 'Marc-André' },
  { id: '2', nom: 'Leclerc', prenom: 'Chantal' },
  { id: '3', nom: 'Côté', prenom: 'Jean-Luc' },
  { id: '4', nom: 'Blais', prenom: 'Martine' },
  { id: '5', nom: 'Deschênes', prenom: 'Pierre' },
];

const TASKS_TEMPLATE = Array.from({ length: 12 }, (_, i) => ({
  ordre: i + 1,
  nom: ['Inspection du site', 'Fondations', 'Charpente', 'Couverture', 'Murs extérieurs', 'Fenêtres et portes', 'Plomberie brute', 'Électricité brute', 'Isolation et gypse', 'Finitions intérieures', 'Peinture', 'Finitions finales'][i],
}));

export default function NouveauProjetPage() {
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [typeProjet, setTypeProjet] = useState('MAISON');
  const [typeContrat, setTypeContrat] = useState('PRELIMINAIRE');
  const [dateLivraison, setDateLivraison] = useState('');
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (step === 1 && !clientId) {
      alert('Sélectionnez un client');
      return;
    }
    if (step === 2 && (!adresse || !ville || !dateLivraison)) {
      alert('Remplissez tous les champs');
      return;
    }
    setStep(step + 1);
  };

  const handleCreate = async () => {
    setSaving(true);
    console.log('Créer projet');
    setTimeout(() => {
      alert('Projet créé avec succès!');
      window.location.href = '/projets';
    }, 1000);
  };

  const client = CLIENTS.find(c => c.id === clientId);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouveau Projet</h1>

        <div className="flex gap-4 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full ${s < step ? 'bg-green-500' : s === step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <p className="text-xs text-gray-600 mt-2 font-medium">
                {s === 1 ? 'Client' : s === 2 ? 'Infos Projet' : 'Validation'}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="client">Sélectionner un client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choisir un client" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.prenom} {c.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Client: {client?.prenom} {client?.nom}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adresse">Adresse *</Label>
                <Input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="ex: 148 Morin" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Input id="ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="ex: St-Agapit" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="typeProjet">Type *</Label>
                <Select value={typeProjet} onValueChange={setTypeProjet}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAISON">Maison</SelectItem>
                    <SelectItem value="JUMELE">Jumelé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="typeContrat">Contrat *</Label>
                <Select value={typeContrat} onValueChange={setTypeContrat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRELIMINAIRE">Préliminaire</SelectItem>
                    <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dateLivraison">Livraison prévue *</Label>
              <Input id="dateLivraison" type="date" value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} className="mt-2" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-2 items-center text-green-900">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Prêt à créer</span>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Client</p>
                  <p className="font-semibold">{client?.prenom} {client?.nom}</p>
                </div>
                <div>
                  <p className="text-gray-600">Adresse</p>
                  <p className="font-semibold">{adresse}, {ville}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold">{typeProjet}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contrat</p>
                  <p className="font-semibold">{typeContrat}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Tâches (12)</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {TASKS_TEMPLATE.map(t => (
                    <div key={t.ordre} className="text-gray-600">
                      {t.ordre}. {t.nom}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-12">
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button>}
          {step < 3 ? (
            <Button onClick={handleNext} className="gap-2 bg-blue-600 hover:bg-blue-700 ml-auto">
              Suivant <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 ml-auto">
              {saving ? 'Création...' : 'Créer'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
