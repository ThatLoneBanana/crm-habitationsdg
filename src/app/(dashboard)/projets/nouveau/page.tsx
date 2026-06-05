'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from 'lucide-react';
import { subJoursOuvrables, countJoursOuvrables } from '@/lib/template-utils';

interface Client {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

interface Template {
  id: string;
  etapes: any[];
}

interface EtapeCedule {
  ordre: number;
  nom: string;
  joursDefaut: number;
  assigneA?: string;
  visibleClient: boolean;
  dateDebut: Date;
  dateFin: Date;
  buffer: number;
}

export default function NouveauProjetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Record<string, Template>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Étape 1: Client
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({ prenom: '', nom: '', email: '', telephone: '' });

  // Étape 2: Projet
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [typeProjet, setTypeProjet] = useState('MAISON');
  const [typeContrat, setTypeContrat] = useState('PRELIMINAIRE');
  const [montant, setMontant] = useState('');
  const [dateContrat, setDateContrat] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');
  const [vendeur, setVendeur] = useState('');
  const [chargeProjet, setChargeProjet] = useState('Louis Bellavance');
  const [users, setUsers] = useState<any[]>([]);

  // Étape 3: Cédule
  const [etapes, setEtapes] = useState<EtapeCedule[]>([]);

  // Charger clients et templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, templateRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/templates'),
        ]);
        const clientData = await clientRes.json();
        const templateData = await templateRes.json();

        setClients(clientData.clients || []);

        // Organiser les templates par type
        const templatesByType: Record<string, Template> = {};
        templateData.templates.forEach((t: any) => {
          templatesByType[t.type] = t;
        });
        setTemplates(templatesByType);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Générer l'URL client automatiquement
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const generatedUrl = selectedClient && montant && adresse
    ? `/p/${selectedClient.prenom.toLowerCase()}${selectedClient.nom.toLowerCase()}-${Math.random().toString(36).substr(2, 6)}-${adresse.split(' ')[0].toLowerCase()}`
    : '';

  // Charger le template quand on change le type de projet
  useEffect(() => {
    if (step === 3 && dateLivraison && typeProjet && templates[typeProjet]) {
      const template = templates[typeProjet];
      const livraison = new Date(dateLivraison);
      let cursor = new Date(livraison);

      const calculatedEtapes: EtapeCedule[] = [...template.etapes]
        .reverse()
        .map((e: any, idx: number) => {
          const buffer = 0;
          if (buffer > 0) cursor = subJoursOuvrables(cursor, buffer);
          const dateFin = new Date(cursor);
          const dateDebut = e.joursDefaut <= 1
            ? new Date(cursor)
            : subJoursOuvrables(cursor, e.joursDefaut - 1);
          cursor = subJoursOuvrables(dateDebut, 1);
          return {
            ordre: e.ordre,
            nom: e.nom,
            joursDefaut: e.joursDefaut,
            assigneA: e.assigneA,
            visibleClient: e.visibleClient,
            dateDebut,
            dateFin,
            buffer,
          };
        })
        .reverse();

      setEtapes(calculatedEtapes);
    }
  }, [step, dateLivraison, typeProjet, templates]);

  // Ajouter nouveau client inline
  const handleAddClient = async () => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClientData),
      });
      if (!res.ok) throw new Error('Erreur création client');
      const { client } = await res.json();
      setClients([...clients, client]);
      setSelectedClientId(client.id);
      setShowNewClientForm(false);
      setNewClientData({ prenom: '', nom: '', email: '', telephone: '' });
    } catch (err) {
      alert('Erreur: ' + (err as any).message);
    }
  };

  // Créer le projet
  const handleCreateProject = async () => {
    if (!selectedClientId || !adresse || !ville || !dateLivraison || !montant || !vendeur) {
      alert('Remplissez tous les champs');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/projets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          adresse,
          ville,
          typeProjet,
          typeContrat,
          montantTotal: parseFloat(montant),
          dateContrat: dateContrat ? new Date(dateContrat) : null,
          dateLivraison,
          vendeur,
          chargeProjet,
          urlClient: generatedUrl,
          etapes: etapes.map(e => ({
            nom: e.nom,
            ordre: e.ordre,
            dateDebut: e.dateDebut,
            dateFin: e.dateFin,
            dureeJours: e.joursDefaut,
            assigneA: e.assigneA,
            visibleClient: e.visibleClient,
          })),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur création projet');
      }

      const { projet } = await res.json();
      router.push(`/projets/${projet.slug}`);
    } catch (err) {
      alert('Erreur: ' + (err as any).message);
    } finally {
      setSaving(false);
    }
  };

  // Stepper
  const steps = ['Client', 'Projet', 'Cédule', 'Confirmation'];
  const StepIndicator = ({ stepNum }: { stepNum: number }) => {
    if (stepNum < step) {
      return <CheckCircle className="w-8 h-8 text-green-600" />;
    } else if (stepNum === step) {
      return <Circle className="w-8 h-8 text-teal-600 fill-teal-600" />;
    } else {
      return <Circle className="w-8 h-8 text-gray-300" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Nouveau Projet</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((stepName, idx) => (
          <div key={idx} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <StepIndicator stepNum={idx + 1} />
              <p className="text-xs mt-2 text-gray-600 font-medium">{stepName}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${idx < step - 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ÉTAPE 1: CLIENT */}
      {step === 1 && (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <Label htmlFor="client">Sélectionner un client *</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.prenom} {c.nom} ({c.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!showNewClientForm ? (
            <Button onClick={() => setShowNewClientForm(true)} variant="outline" className="w-full">
              + Créer un nouveau client
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-white border rounded-lg">
              <Input
                placeholder="Prénom"
                value={newClientData.prenom}
                onChange={(e) => setNewClientData({ ...newClientData, prenom: e.target.value })}
              />
              <Input
                placeholder="Nom"
                value={newClientData.nom}
                onChange={(e) => setNewClientData({ ...newClientData, nom: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newClientData.email}
                onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
              />
              <Input
                placeholder="Téléphone"
                value={newClientData.telephone}
                onChange={(e) => setNewClientData({ ...newClientData, telephone: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddClient} className="flex-1 bg-green-600">Créer</Button>
                <Button onClick={() => setShowNewClientForm(false)} variant="outline" className="flex-1">Annuler</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE 2: INFORMATIONS PROJET */}
      {step === 2 && (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Adresse *</Label>
              <Input value={adresse} onChange={(e) => setAdresse(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Ville *</Label>
              <Input value={ville} onChange={(e) => setVille(e.target.value)} className="mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type de projet *</Label>
              <Select value={typeProjet} onValueChange={setTypeProjet}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAISON">Maison</SelectItem>
                  <SelectItem value="JUMELE">Jumelé</SelectItem>
                  <SelectItem value="MULTILOGEMENT">Multilogement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type de contrat *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Montant du contrat ($) *</Label>
              <Input type="number" step="1000" value={montant} onChange={(e) => setMontant(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Date du contrat</Label>
              <Input type="date" value={dateContrat} onChange={(e) => setDateContrat(e.target.value)} className="mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date de livraison *</Label>
              <Input type="date" value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Vendeur assigné *</Label>
              <Input value={vendeur} onChange={(e) => setVendeur(e.target.value)} placeholder="ex: Marc-André Gagné" className="mt-2" />
            </div>
          </div>

          <div>
            <Label>Chargé de projet</Label>
            <Input value={chargeProjet} onChange={(e) => setChargeProjet(e.target.value)} className="mt-2" />
          </div>

          {generatedUrl && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <p className="text-xs text-blue-600">URL client générée:</p>
              <p className="text-sm font-mono text-blue-900">{generatedUrl}</p>
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE 3: CÉDULE */}
      {step === 3 && dateLivraison && (
        <div className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded">
            <p className="text-sm font-medium text-teal-900">
              Livraison le {new Date(dateLivraison).toLocaleDateString('fr-CA')} —
              Total: {etapes.length > 0 ? countJoursOuvrables(etapes[0].dateDebut, new Date(dateLivraison)) : 0} jours ouvrables
            </p>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-2 text-left font-semibold">N°</th>
                  <th className="px-3 py-2 text-left font-semibold">Étape</th>
                  <th className="px-3 py-2 text-left font-semibold">Jours</th>
                  <th className="px-3 py-2 text-left font-semibold">Début</th>
                  <th className="px-3 py-2 text-left font-semibold">Fin</th>
                  <th className="px-3 py-2 text-left font-semibold">Assigné</th>
                  <th className="px-3 py-2 text-left font-semibold">Client</th>
                </tr>
              </thead>
              <tbody>
                {etapes.map((e, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2">{e.ordre}</td>
                    <td className="px-3 py-2 font-medium">{e.nom}</td>
                    <td className="px-3 py-2">{e.joursDefaut}j</td>
                    <td className="px-3 py-2 text-xs">{e.dateDebut.toLocaleDateString('fr-CA')}</td>
                    <td className="px-3 py-2 text-xs">{e.dateFin.toLocaleDateString('fr-CA')}</td>
                    <td className="px-3 py-2 text-xs">{e.assigneA || 'Interne'}</td>
                    <td className="px-3 py-2">{e.visibleClient ? '✓' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ÉTAPE 4: CONFIRMATION */}
      {step === 4 && (
        <div className="space-y-6 bg-green-50 border border-green-200 p-6 rounded-lg">
          <h2 className="font-semibold text-gray-900">Récapitulatif</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Client:</p>
              <p className="font-medium">{selectedClient?.prenom} {selectedClient?.nom}</p>
            </div>
            <div>
              <p className="text-gray-600">Adresse:</p>
              <p className="font-medium">{adresse}, {ville}</p>
            </div>
            <div>
              <p className="text-gray-600">Type:</p>
              <p className="font-medium">{typeProjet === 'JUMELE' ? 'Jumelé' : typeProjet === 'MAISON' ? 'Maison' : 'Multilogement'}</p>
            </div>
            <div>
              <p className="text-gray-600">Contrat:</p>
              <p className="font-medium">{typeContrat === 'PRELIMINAIRE' ? 'Préliminaire' : 'Entreprise'}</p>
            </div>
            <div>
              <p className="text-gray-600">Montant:</p>
              <p className="font-medium">${parseFloat(montant).toLocaleString('fr-CA')}</p>
            </div>
            <div>
              <p className="text-gray-600">Livraison:</p>
              <p className="font-medium">{new Date(dateLivraison).toLocaleDateString('fr-CA')}</p>
            </div>
            <div>
              <p className="text-gray-600">Vendeur:</p>
              <p className="font-medium">{vendeur}</p>
            </div>
            <div>
              <p className="text-gray-600">Chargé de projet:</p>
              <p className="font-medium">{chargeProjet}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-green-300">
            <p className="text-sm text-gray-600">{etapes.length} étapes générées</p>
            <p className="text-sm text-gray-600">Paiements: {typeContrat === 'PRELIMINAIRE' ? '2 tranches' : '3 tranches'}</p>
          </div>
        </div>
      )}

      {/* BOUTONS */}
      <div className="flex gap-4 mt-12">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/projets')}
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? 'Annuler' : 'Retour'}
        </Button>

        {step < 4 ? (
          <Button
            onClick={() => {
              if (step === 1 && !selectedClientId) {
                alert('Sélectionnez un client');
                return;
              }
              if (step === 2 && (!adresse || !ville || !dateLivraison || !montant || !vendeur)) {
                alert('Remplissez tous les champs obligatoires');
                return;
              }
              setStep(step + 1);
            }}
            className="flex-1 gap-2 bg-blue-600"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateProject}
            disabled={saving}
            className="flex-1 bg-green-600"
          >
            {saving ? 'Création...' : 'Créer le projet'}
          </Button>
        )}
      </div>
    </div>
  );
}
