'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { ClientDialog } from '@/components/clients/client-dialog';

const ETAPES_TEMPLATE = [
  { nom: 'Inspection du site', dureeJours: 1 },
  { nom: 'Fondations', dureeJours: 10 },
  { nom: 'Charpente', dureeJours: 8 },
  { nom: 'Couverture', dureeJours: 3 },
  { nom: 'Murs extérieurs', dureeJours: 7 },
  { nom: 'Fenêtres et portes', dureeJours: 5 },
  { nom: 'Plomberie brute', dureeJours: 6 },
  { nom: 'Électricité brute', dureeJours: 6 },
  { nom: 'Isolation', dureeJours: 5 },
  { nom: 'Gypse intérieur', dureeJours: 8 },
  { nom: 'Plomberie finitions', dureeJours: 5 },
  { nom: 'Électricité finitions', dureeJours: 5 },
  { nom: 'Revêtements sol', dureeJours: 6 },
  { nom: 'Murs intérieurs', dureeJours: 7 },
  { nom: 'Peinture intérieure', dureeJours: 5 },
  { nom: 'Portes intérieures', dureeJours: 3 },
  { nom: 'Armoires cuisine', dureeJours: 3 },
  { nom: 'Comptoirs cuisine', dureeJours: 2 },
  { nom: 'Finitions salles de bain', dureeJours: 4 },
  { nom: 'Installation luminaires', dureeJours: 2 },
  { nom: 'Installation robinetterie', dureeJours: 2 },
  { nom: 'Revêtement extérieur', dureeJours: 8 },
  { nom: 'Peinture extérieure', dureeJours: 3 },
  { nom: 'Terrasses et entrées', dureeJours: 5 },
  { nom: 'Aménagement extérieur', dureeJours: 4 },
  { nom: 'Clôture', dureeJours: 3 },
  { nom: 'Accès véhiculaire', dureeJours: 2 },
  { nom: 'Ensemencement gazon', dureeJours: 1 },
  { nom: 'Nettoyage final', dureeJours: 2 },
  { nom: 'Inspection finale', dureeJours: 1 },
  { nom: 'Corrections mineures', dureeJours: 2 },
  { nom: 'Signature final', dureeJours: 1 },
  { nom: 'Remise des clés', dureeJours: 1 },
];

interface Client {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

export default function NouveauProjetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  // Step 1
  const [clientId, setClientId] = useState('');

  // Step 2
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [typeProjet, setTypeProjet] = useState('MAISON');
  const [typeContrat, setTypeContrat] = useState('PRELIMINAIRE');
  const [montant, setMontant] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');
  const [vendeur, setVendeur] = useState('');

  const [saving, setSaving] = useState(false);

  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Erreur chargement clients');
        const data = await res.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleClientCreated = (newClient: Client) => {
    setClients([newClient, ...clients]);
    setClientId(newClient.id);
    setClientDialogOpen(false);
  };

  const handleNext = () => {
    if (step === 1 && !clientId) {
      alert('Sélectionnez un client');
      return;
    }
    if (step === 2) {
      if (!adresse || !ville || !dateLivraison || !montant || !vendeur) {
        alert('Remplissez tous les champs');
        return;
      }
      if (isNaN(parseFloat(montant)) || parseFloat(montant) <= 0) {
        alert('Le montant doit être un nombre positif');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleCreate = async () => {
    if (!clientId || !adresse || !ville || !dateLivraison || !montant) {
      alert('Veuillez compléter tous les champs');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/projets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          adresse,
          ville,
          typeProjet,
          typeContrat,
          montantTotal: parseFloat(montant),
          dateLivraison,
          vendeur,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur création projet');
      }

      const data = await res.json();
      router.push(`/projets/${data.projet.slug}`);
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedClient = clients.find(c => c.id === clientId);

  if (loadingClients) {
    return <div className="p-8 text-center text-gray-500">Chargement des clients...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Nouveau Projet</h1>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-4 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full ${s < step ? 'bg-green-500' : s === step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <p className="text-xs text-gray-600 mt-2 font-medium">
                {s === 1 ? 'Client' : s === 2 ? 'Infos' : 'Validation'}
              </p>
            </div>
          ))}
        </div>

        {/* ÉTAPE 1: CLIENT */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="client">Sélectionner un client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
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

            <div className="border-t pt-6">
              <Button
                variant="outline"
                onClick={() => setClientDialogOpen(true)}
                className="w-full"
              >
                + Créer un nouveau client
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: INFOS PROJET */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Client: <strong>{selectedClient?.prenom} {selectedClient?.nom}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adresse">Adresse *</Label>
                <Input
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="ex: 148 Morin"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="ex: St-Agapit"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="typeProjet">Type de projet *</Label>
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
                <Label htmlFor="typeContrat">Type de contrat *</Label>
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
                <Label htmlFor="montant">Montant du contrat ($) *</Label>
                <Input
                  id="montant"
                  type="number"
                  step="1000"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="ex: 300000"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="vendeur">Vendeur assigné *</Label>
                <Input
                  id="vendeur"
                  value={vendeur}
                  onChange={(e) => setVendeur(e.target.value)}
                  placeholder="ex: Marc-André Gagné"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dateLivraison">Date de livraison prévue *</Label>
              <Input
                id="dateLivraison"
                type="date"
                value={dateLivraison}
                onChange={(e) => setDateLivraison(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 3: RÉCAPITULATIF */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-2 items-center text-green-900 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Prêt à créer le projet</span>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Client:</strong> {selectedClient?.prenom} {selectedClient?.nom}</p>
                <p><strong>Adresse:</strong> {adresse}, {ville}</p>
                <p><strong>Type:</strong> {typeProjet === 'MAISON' ? 'Maison' : typeProjet === 'JUMELE' ? 'Jumelé' : 'Multilogement'}</p>
                <p><strong>Contrat:</strong> {typeContrat === 'PRELIMINAIRE' ? 'Préliminaire' : 'Entreprise'}</p>
                <p><strong>Montant:</strong> ${parseFloat(montant).toLocaleString('fr-CA')}</p>
                <p><strong>Livraison:</strong> {new Date(dateLivraison).toLocaleDateString('fr-CA')}</p>
                <p><strong>Vendeur:</strong> {vendeur}</p>
                <p className="text-xs italic mt-4">✓ {ETAPES_TEMPLATE.length} étapes seront créées automatiquement</p>
                <p className="text-xs italic">✓ Paiements configurés selon le type de contrat</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-12">
          <Button variant="outline" onClick={() => router.push('/projets')} className="flex-1">
            Annuler
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} className="flex-1 gap-2">
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={saving} className="flex-1">
              {saving ? 'Création...' : 'Créer le projet'}
            </Button>
          )}
        </div>
      </div>

      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
