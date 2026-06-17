'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { genererSlug } from '@/lib/template-utils';
import CedulaEditor from '@/components/cedule/CedulaEditor';
import { detecterConflits, creerMoteurCedule, type EtapeEditable } from '@/lib/cedula-utils';
import { formatDate } from '@/lib/utils';

interface Client {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

interface Template {
  id: string;
  nom: string;
  type: 'JUMELE' | 'MAISON' | 'MULTILOGEMENT';
  etapes: any[];
}

const TYPE_LABEL_TPL: Record<string, string> = { JUMELE: 'Jumelé', MAISON: 'Maison', MULTILOGEMENT: 'Multilogement' };

interface EtapeCedule {
  ordre: number;
  nom: string;
  joursDefaut: number;
  assigneA?: string;
  visibleClient: boolean;
  interne: boolean;
  dateDebut: Date;
  dateFin: Date;
  buffer: number; // jours vides APRÈS cette étape avant la suivante
  groupeId?: string | null; // lien « même jour » (bloc) — facultatif
  ancrageInspection?: 'GYPSE' | 'FINITION' | null; // marqueur d'ancre GCR — facultatif
}

interface Fournisseur {
  nom: string;
}

// Fonctions de formatage
function formatTypeProjet(type: string): string {
  const map: Record<string, string> = { 'JUMELE': 'Jumelé', 'MAISON': 'Maison', 'MULTILOGEMENT': 'Multilogement' };
  return map[type] || type;
}

function formatTypeContrat(type: string): string {
  const map: Record<string, string> = { 'PRELIMINAIRE': 'Préliminaire', 'ENTREPRISE': 'Entreprise' };
  return map[type] || type;
}

function formatPhase(phase: string): string {
  const map: Record<string, string> = {
    'SIGNE': 'Signé', 'PREPARATION': 'Préparation',
    'CHANTIER': 'Chantier', 'LIVRAISON': 'Livraison', 'TERMINE': 'Terminé'
  };
  return map[phase] || phase;
}

export default function NouveauProjetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Record<string, Template>>({});
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

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
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [margeCeduleJours, setMargeCeduleJours] = useState(5);

  // Étape 3: Cédule
  const [sansCedule, setSansCedule] = useState(false);
  const [projetDebut, setProjetDebut] = useState<Date | null>(null);
  const [etapes, setEtapes] = useState<EtapeCedule[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [conflits, setConflits] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [ignoreOverflow, setIgnoreOverflow] = useState(false);

  // Flag pour charger le template une seule fois
  const [templateCharge, setTemplateCharge] = useState(false);

  // Moteur conscient des vacances (helpers liés aux périodes). Déclaré avant les
  // effets/cascade qui l'utilisent. Sans période → comportement identique.
  const { addJoursOuvrables, subJoursOuvrables, countJoursOuvrables } = useMemo(() => creerMoteurCedule(periodes), [periodes]);

  // Charger clients, templates et fournisseurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, templateRes, fournisseurRes, parametresRes, periodesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/templates'),
          fetch('/api/fournisseurs'),
          fetch('/api/parametres'),
          fetch('/api/periodes-non-ouvrables'),
        ]);
        const clientData = await clientRes.json();
        const templateData = await templateRes.json();
        const fournisseurData = await fournisseurRes.json();
        const parametresData = await parametresRes.json();

        setClients(clientData.clients || []);
        setFournisseurs(fournisseurData.fournisseurs || []);
        const marge = parametresData.parametres?.margeCeduleJours
        if (typeof marge === 'number') setMargeCeduleJours(marge)

        const templatesByType: Record<string, Template> = {};
        templateData.templates.forEach((t: any) => {
          templatesByType[t.type] = t;
        });
        setTemplates(templatesByType);
        setAllTemplates(templateData.templates || []);

        const periodesData = await periodesRes.json().catch(() => ({ periodes: [] }));
        setPeriodes(periodesData.periodes || []);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Générer URL au blur (pas à chaque touche)
  const handleGenerateUrl = () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (client && adresse && ville) {
      const url = genererSlug(client.prenom, client.nom, adresse);
      setGeneratedUrl(`/p/${url}`);
    }
  };

  // #9-A — Génère la cédule depuis le TEMPLATE CHOISI explicitement (aucun défaut
  //   présélectionné). Régénère uniquement quand le template sélectionné change ;
  //   le garde-fou lastGenTpl évite d'écraser des éditions manuelles si on revient
  //   sur l'étape. Le calcul des dates (cascade à rebours depuis la livraison) est
  //   INCHANGÉ — seule la source passe du type au choix explicite.
  const lastGenTpl = useRef<string | null>(null);
  useEffect(() => {
    if (step !== 3 || !selectedTemplateId || !dateLivraison) return;
    if (lastGenTpl.current === selectedTemplateId) return;

    const template = allTemplates.find((t) => t.id === selectedTemplateId);
    if (!template || !template.etapes || template.etapes.length === 0) { setEtapes([]); return; }

    const livraison = new Date(dateLivraison);
    let cursor = subJoursOuvrables(livraison, margeCeduleJours);

    const tempEtapes = template.etapes.map((e: any) => ({
      ordre: e.ordre,
      nom: e.nom,
      joursDefaut: e.joursDefaut,
      assigneA: e.assigneA,
      visibleClient: e.visibleClient,
      interne: e.interne,
      buffer: 0,
    }));

    const calculatedEtapes: EtapeCedule[] = [];
    for (let i = tempEtapes.length - 1; i >= 0; i--) {
      const e = tempEtapes[i];
      const dateFin = new Date(cursor);
      const dateDebut = e.joursDefaut <= 1
        ? new Date(cursor)
        : subJoursOuvrables(cursor, e.joursDefaut - 1);

      const bufferActuel = e.buffer || 0;
      cursor = subJoursOuvrables(dateDebut, 1 + bufferActuel);

      calculatedEtapes.unshift({ ...e, dateDebut, dateFin });
    }

    setEtapes(calculatedEtapes);
    if (calculatedEtapes.length > 0) setProjetDebut(calculatedEtapes[0].dateDebut);
    setConflits(detecterConflits(calculatedEtapes));
    setTemplateCharge(true);
    lastGenTpl.current = selectedTemplateId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedTemplateId]);

  // Recalculer les dates si dateLivraison change (mais garder les durées modifiées)
  useEffect(() => {
    if (etapes.length > 0 && dateLivraison && !templateCharge) {
      const livraison = new Date(dateLivraison);
      const nouvelleAncre = subJoursOuvrables(livraison, margeCeduleJours);
      let cursor = new Date(nouvelleAncre);

      const newEtapes = JSON.parse(JSON.stringify(etapes));
      for (let i = newEtapes.length - 1; i >= 0; i--) {
        const e = newEtapes[i];
        e.dateFin = new Date(cursor);
        e.dateDebut = e.joursDefaut <= 1
          ? new Date(cursor)
          : subJoursOuvrables(cursor, e.joursDefaut - 1);

        const bufferPrec = i > 0 ? newEtapes[i - 1].buffer : 0;
        cursor = subJoursOuvrables(e.dateDebut, 1 + bufferPrec);
      }

      setEtapes(newEtapes);
    }
  }, [dateLivraison]);

  // Cascade vers le bas depuis une date de début modifiée
  const cascadeVersBas = (etapesArray: EtapeCedule[], indexModifie: number) => {
    for (let i = indexModifie + 1; i < etapesArray.length; i++) {
      const prev = etapesArray[i - 1];
      const bufferPrev = prev.buffer || 0;
      etapesArray[i].dateDebut = addJoursOuvrables(prev.dateFin, 1 + bufferPrev);
      etapesArray[i].dateFin = etapesArray[i].joursDefaut <= 1
        ? new Date(etapesArray[i].dateDebut)
        : addJoursOuvrables(etapesArray[i].dateDebut, etapesArray[i].joursDefaut - 1);
    }
  };

  // Cascade vers le haut depuis une date de fin modifiée
  const cascadeVersHaut = (etapesArray: EtapeCedule[], indexModifie: number) => {
    for (let i = indexModifie - 1; i >= 0; i--) {
      const next = etapesArray[i + 1];
      const bufferCurrent = etapesArray[i].buffer || 0;
      etapesArray[i].dateFin = subJoursOuvrables(next.dateDebut, 1 + bufferCurrent);
      etapesArray[i].dateDebut = etapesArray[i].joursDefaut <= 1
        ? new Date(etapesArray[i].dateFin)
        : subJoursOuvrables(etapesArray[i].dateFin, etapesArray[i].joursDefaut - 1);
    }
  };

  // Réinitialiser les dates aux valeurs originales du template
  const handleResetDates = async () => {
    if (!confirm('Réinitialiser toutes les dates ? Les modifications seront perdues.')) return;

    if (dateLivraison && typeProjet && templates[typeProjet]) {
      const template = templates[typeProjet];
      const livraison = new Date(dateLivraison);
      let cursor = new Date(livraison);

      const tempEtapes = template.etapes.map((e: any) => ({
        ordre: e.ordre,
        nom: e.nom,
        joursDefaut: e.joursDefaut,
        assigneA: e.assigneA,
        visibleClient: e.visibleClient,
        buffer: 0, // reset buffer
      }));

      const calculatedEtapes: EtapeCedule[] = [];
      for (let i = tempEtapes.length - 1; i >= 0; i--) {
        const e = tempEtapes[i];
        const dateFin = new Date(cursor);
        const dateDebut = e.joursDefaut <= 1
          ? new Date(cursor)
          : subJoursOuvrables(cursor, e.joursDefaut - 1);
        const bufferActuel = e.buffer || 0;
        cursor = subJoursOuvrables(dateDebut, 1 + bufferActuel);
        calculatedEtapes.unshift({
          ...e,
          dateDebut,
          dateFin,
          interne: false,
        });
      }

      setEtapes(calculatedEtapes);
      setConflits(detecterConflits(calculatedEtapes));
    }
  };

  // Ajouter une nouvelle étape en bas
  const handleAddEtape = () => {
    const newEtape: EtapeCedule = {
      ordre: etapes.length + 1,
      nom: 'Nouvelle étape',
      joursDefaut: 1,
      assigneA: undefined,
      visibleClient: true,
      interne: false,
      dateDebut: etapes.length > 0 ? addJoursOuvrables(etapes[etapes.length - 1].dateFin, 1) : new Date(),
      dateFin: etapes.length > 0 ? addJoursOuvrables(etapes[etapes.length - 1].dateFin, 1) : new Date(),
      buffer: 0,
    };
    const newEtapes = [...etapes, newEtape];
    setEtapes(newEtapes);
    setEditingId(newEtapes.length - 1);
    setEditingField('nom');
    setEditValue('Nouvelle étape');
  };

  // Insérer une nouvelle étape à une position précise
  const handleInsertEtape = (position: number) => {
    const prev = position > 0 ? etapes[position - 1] : null;
    const next = position < etapes.length ? etapes[position] : null;

    let dateDebut = new Date();
    let dateFin = new Date();

    if (prev && next) {
      // Entre deux étapes: calculer la date entre les deux
      const space = countJoursOuvrables(prev.dateFin, next.dateDebut);
      dateDebut = addJoursOuvrables(prev.dateFin, 1);
      dateFin = space > 1 ? addJoursOuvrables(dateDebut, 0) : dateDebut;
    } else if (prev) {
      dateDebut = addJoursOuvrables(prev.dateFin, 1);
      dateFin = dateDebut;
    }

    const newEtape: EtapeCedule = {
      ordre: position + 1,
      nom: 'Nouvelle étape',
      joursDefaut: 1,
      assigneA: undefined,
      visibleClient: true,
      interne: false,
      dateDebut,
      dateFin,
      buffer: 0,
    };

    const newEtapes = [
      ...etapes.slice(0, position),
      newEtape,
      ...etapes.slice(position).map(e => ({ ...e, ordre: e.ordre + 1 }))
    ];

    setEtapes(newEtapes);
    setEditingId(position);
    setEditingField('nom');
    setEditValue('Nouvelle étape');
  };

  // Supprimer une étape
  const handleDeleteEtape = (idx: number) => {
    const newEtapes = etapes.filter((_, i) => i !== idx).map((e, i) => ({ ...e, ordre: i + 1 }));
    setEtapes(newEtapes);
    cascadeVersBas(newEtapes, Math.max(0, idx - 1));
    setConflits(detecterConflits(newEtapes));
    setShowDeleteConfirm(null);
  };

  // Modifier date de début du projet
  const handleProjetDebutChange = (newDate: Date) => {
    setProjetDebut(newDate);
    const newEtapes = [...etapes];
    if (newEtapes.length > 0) {
      newEtapes[0].dateDebut = newDate;
      newEtapes[0].dateFin = newEtapes[0].joursDefaut <= 1
        ? new Date(newDate)
        : addJoursOuvrables(newDate, newEtapes[0].joursDefaut - 1);
      cascadeVersBas(newEtapes, 0);
      setEtapes(newEtapes);
      setConflits(detecterConflits(newEtapes));
    }
  };

  // Modifier date fin d'une étape (cascade vers le haut)
  const handleDateFinChange = (idx: number, newDateFin: Date) => {
    const newEtapes = [...etapes];
    newEtapes[idx].dateFin = newDateFin;
    newEtapes[idx].joursDefaut = countJoursOuvrables(newEtapes[idx].dateDebut, newDateFin);
    cascadeVersHaut(newEtapes, idx);
    setEtapes(newEtapes);
    setConflits(detecterConflits(newEtapes));
  };

  // Recalculer à partir d'une étape modifiée avec cascade à rebours (avec buffer)
  const recalculateFromEtape = (modifiedIdx: number, newDateDebut: Date, newJours?: number) => {
    const newEtapes = [...etapes];
    const joursOuv = newJours || countJoursOuvrables(newDateDebut, newEtapes[modifiedIdx].dateFin);

    // Mettre à jour l'étape modifiée
    newEtapes[modifiedIdx] = {
      ...newEtapes[modifiedIdx],
      dateDebut: newDateDebut,
      joursDefaut: joursOuv,
      dateFin: joursOuv <= 1 ? new Date(newDateDebut) : addJoursOuvrables(newDateDebut, joursOuv - 1),
    };

    // Recalculer les étapes PRÉCÉDENTES à rebours (cascade vers le haut)
    for (let i = modifiedIdx - 1; i >= 0; i--) {
      const suivante = newEtapes[i + 1];
      const bufferActuel = newEtapes[i].buffer || 0;

      // dateFin de cette étape = dateDebut de la suivante - 1 - bufferActuel jours ouvrables
      const dateFin = subJoursOuvrables(suivante.dateDebut, 1 + bufferActuel);

      // dateDebut de cette étape
      const dateDebut = newEtapes[i].joursDefaut <= 1
        ? new Date(dateFin)
        : subJoursOuvrables(dateFin, newEtapes[i].joursDefaut - 1);

      newEtapes[i] = {
        ...newEtapes[i],
        dateDebut,
        dateFin,
      };
    }

    // Recalculer les étapes SUIVANTES vers l'avant
    for (let i = modifiedIdx + 1; i < newEtapes.length; i++) {
      const precedente = newEtapes[i - 1];
      const bufferPrecedent = precedente.buffer || 0;
      const dateDebut = addJoursOuvrables(precedente.dateFin, 1 + bufferPrecedent);

      const dateFin = newEtapes[i].joursDefaut <= 1
        ? new Date(dateDebut)
        : addJoursOuvrables(dateDebut, newEtapes[i].joursDefaut - 1);

      newEtapes[i] = {
        ...newEtapes[i],
        dateDebut,
        dateFin,
      };
    }

    setEtapes(newEtapes);

    // Détecter les conflits
    const newConflits = detecterConflits(newEtapes);
    setConflits(newConflits);
  };

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
    try {
      setSaving(true);
      setError(null);

      if (!selectedClientId || !adresse || !ville || !dateLivraison || !montant || !vendeur) {
        throw new Error('Remplissez tous les champs obligatoires');
      }

      console.log('Body envoyé:', {
        clientId: selectedClientId,
        adresse,
        ville,
        typeProjet,
        typeContrat,
        montantTotal: parseFloat(montant),
        dateContrat,
        dateLivraison,
        vendeur,
        chargeProjet,
        urlClient: generatedUrl,
        etapesCount: etapes.length,
        premiereEtape: etapes[0],
      });

      // FIX: Assure que les étapes sont synchronisées correctement
      const etapesAEnvoyer = sansCedule ? [] : etapes.map(e => ({
        nom: e.nom,
        ordre: e.ordre,
        jours: e.joursDefaut,
        dateDebut: e.dateDebut instanceof Date ? e.dateDebut.toISOString() : e.dateDebut,
        dateFin: e.dateFin instanceof Date ? e.dateFin.toISOString() : e.dateFin,
        assigneA: e.assigneA,
        visibleClient: e.visibleClient,
        interne: e.interne,
        buffer: e.buffer || 0,
        groupeId: e.groupeId ?? null,
        ancrageInspection: e.ancrageInspection ?? null,
      }));

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
          dateContrat: dateContrat || null,
          dateLivraison,
          vendeur,
          chargeProjet,
          urlClient: generatedUrl,
          etapes: etapesAEnvoyer,
          templateId: selectedTemplateId || null,
        }),
      });

      const text = await res.text();
      console.log('Réponse API:', res.status, text);

      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}: ${text}`);
      }

      if (data.success) {
        router.push(`/projets/${data.slug || data.id}`);
      }
    } catch (err) {
      const errorMsg = (err as any).message || 'Erreur lors de la création du projet';
      console.error('Erreur création:', err);
      setError(errorMsg);
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
    <div className="w-full" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 24px' }}>
      <div className="space-y-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau projet</h1>

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

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => router.push('/projets')} className="flex-1">
                ← Annuler
              </Button>
              <Button onClick={() => setStep(2)} disabled={!selectedClientId} className="flex-1 gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: INFORMATIONS PROJET */}
        {step === 2 && (
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Adresse *</Label>
                <Input
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  onBlur={handleGenerateUrl}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Ville *</Label>
                <Input
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  onBlur={handleGenerateUrl}
                  className="mt-2"
                />
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

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                ← Retour
              </Button>
              <Button onClick={() => setStep(3)} disabled={!dateLivraison || !montant || !vendeur} className="flex-1 gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3: CÉDULE */}
        {step === 3 && dateLivraison && (
          <div className="space-y-6">
            {allTemplates.length === 0 ? (
              <div className="rounded-lg border p-6 text-center" style={{ background: 'var(--warning-tint)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Aucun template de cédule disponible.</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Créez d'abord un template dans Paramètres → Cédules types, ou passez cette étape.</p>
              </div>
            ) : (
              <>
                {/* #9-A — Choix explicite du template (aucun présélectionné). Le type du
                    projet (étape 2) reste sa propre source : il n'est PAS dérivé d'ici. */}
                <div>
                  <Label>Template de cédule</Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger><SelectValue placeholder="Choisir un template…" /></SelectTrigger>
                    <SelectContent>
                      {allTemplates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.nom} — {TYPE_LABEL_TPL[t.type] || t.type} ({t.etapes.length} étapes)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplateId && etapes.length > 0 ? (
            <CedulaEditor
              key={`cedula-editor-${selectedTemplateId}`}
              etapesInitiales={etapes.length > 0 ? etapes.map(e => ({
                id: undefined,
                ordre: e.ordre,
                nom: e.nom,
                jours: e.joursDefaut,
                assigneA: e.assigneA || 'Interne',
                visibleClient: e.visibleClient,
                dateDebut: e.dateDebut,
                dateFin: e.dateFin,
                buffer: e.buffer,
                interne: e.interne,
                groupeId: e.groupeId ?? null,
                ancrageInspection: e.ancrageInspection ?? null,
              })) : undefined}
              typeProjet={typeProjet as any}
              templateId={selectedTemplateId}
              dateLivraison={new Date(dateLivraison)}
              fournisseurs={fournisseurs}
              margeCeduleJours={margeCeduleJours}
              periodes={periodes}
              mode="creation"
              onChange={(newEtapes) => {
                const converted = newEtapes.map(e => ({
                  ordre: e.ordre,
                  nom: e.nom,
                  joursDefaut: e.jours,
                  assigneA: e.assigneA,
                  visibleClient: e.visibleClient,
                  dateDebut: e.dateDebut instanceof Date ? e.dateDebut : new Date(e.dateDebut),
                  dateFin: e.dateFin instanceof Date ? e.dateFin : new Date(e.dateFin),
                  buffer: e.buffer,
                  interne: e.interne,
                  groupeId: e.groupeId ?? null,
                  ancrageInspection: e.ancrageInspection ?? null,
                }));
                setEtapes(converted as any);
                setConflits(detecterConflits(converted as any));
              }}
              onValider={() => {
                if (conflits.length === 0) {
                  setSansCedule(false);
                  setStep(4);
                } else {
                  alert('Veuillez résoudre tous les conflits avant de continuer');
                }
              }}
            />
                ) : (
                  <div className="rounded-lg border p-6 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    Choisissez un template pour générer la cédule.
                  </div>
                )}
              </>
            )}

            {/* Barre de boutons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', alignItems: 'center' }}>
              <button
                onClick={() => setStep(2)}
                style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px' }}
              >
                ← Retour
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSansCedule(true);
                    setStep(4);
                  }}
                  style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}
                >
                  Passer cette étape →
                </button>

                <button
                  onClick={() => {
                    if (conflits.length === 0) {
                      setSansCedule(false);
                      setStep(4);
                    } else {
                      alert('Veuillez résoudre tous les conflits avant de continuer');
                    }
                  }}
                  style={{ padding: '10px 20px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                  Valider la cédule →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4: CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6 bg-green-50 border border-green-200 p-6 rounded-lg">
            <h2 className="font-semibold text-gray-900">Récapitulatif</h2>

            {/* Afficher erreur si elle existe */}
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">❌ {error}</p>
              </div>
            )}

            {/* Récapitulatif complet en grid 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Section Client */}
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Client</h3>
                <p style={{ fontWeight: 600, fontSize: '15px' }}>{clients.find(c => c.id === selectedClientId)?.prenom} {clients.find(c => c.id === selectedClientId)?.nom}</p>
                <p style={{ fontSize: '13px', color: '#666' }}>{clients.find(c => c.id === selectedClientId)?.email}</p>
                <p style={{ fontSize: '13px', color: '#666' }}>{clients.find(c => c.id === selectedClientId)?.telephone}</p>
              </div>

              {/* Section Projet */}
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Projet</h3>
                <p style={{ fontWeight: 600, fontSize: '15px' }}>{adresse}, {ville}</p>
                <p style={{ fontSize: '13px', color: '#666' }}>Type : {formatTypeProjet(typeProjet)} — {formatTypeContrat(typeContrat)}</p>
                <p style={{ fontSize: '13px', color: '#666' }}>Montant : {parseFloat(montant).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                <p style={{ fontSize: '13px', color: '#666' }}>Date du contrat : {formatDate(dateContrat)}</p>
              </div>

              {/* Section Équipe */}
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Équipe</h3>
                <p style={{ fontSize: '13px' }}>Vendeur : <strong>{vendeur}</strong></p>
                <p style={{ fontSize: '13px' }}>Chargé de projet : <strong>{chargeProjet}</strong></p>
              </div>

              {/* Section Cédule */}
              <div>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Cédule</h3>
                {sansCedule ? (
                  <p style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 500 }}>À créer ultérieurement</p>
                ) : (
                  <>
                    <p style={{ fontSize: '13px' }}>Livraison : <strong>{formatDate(dateLivraison)}</strong></p>
                    <p style={{ fontSize: '13px' }}>Début estimé : <strong>{formatDate(etapes[0]?.dateDebut)}</strong></p>
                    <p style={{ fontSize: '13px' }}>Total : <strong>{etapes.length} étapes</strong></p>
                    <p style={{ fontSize: '13px' }}>Durée : <strong>{etapes.length > 0 && dateLivraison ? countJoursOuvrables(etapes[0].dateDebut, new Date(dateLivraison)) : 0} j ouv.</strong></p>
                  </>
                )}
              </div>

              {/* Section Paiements */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Paiements prévus</h3>
                {typeContrat === 'PRELIMINAIRE' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '10px 16px', background: '#EAF3DE', borderRadius: '8px', fontSize: '13px' }}>
                      Acompte : <strong>15 000 $</strong> (reçu à la signature)
                    </div>
                    <div style={{ padding: '10px 16px', background: '#E6F1FB', borderRadius: '8px', fontSize: '13px' }}>
                      Balance : <strong>{(parseFloat(montant) - 15000).toLocaleString('fr-CA')} $</strong> (notaire)
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '10px 16px', background: '#E6F1FB', borderRadius: '8px', fontSize: '13px' }}>
                      50% toiture : <strong>{(parseFloat(montant) * 0.5).toLocaleString('fr-CA')} $</strong>
                    </div>
                    <div style={{ padding: '10px 16px', background: '#E6F1FB', borderRadius: '8px', fontSize: '13px' }}>
                      35% gypse : <strong>{(parseFloat(montant) * 0.35).toLocaleString('fr-CA')} $</strong>
                    </div>
                    <div style={{ padding: '10px 16px', background: '#E6F1FB', borderRadius: '8px', fontSize: '13px' }}>
                      15% remise clés : <strong>{(parseFloat(montant) * 0.15).toLocaleString('fr-CA')} $</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Section URL Client */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Lien client</h3>
                <code style={{ fontSize: '12px', background: '#F1EFE8', padding: '6px 10px', borderRadius: '6px' }}>
                  /p/{generatedUrl || 'généré automatiquement'}
                </code>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                ← Modifier
              </Button>
              <Button onClick={handleCreateProject} disabled={saving} className="flex-1 gap-2 bg-green-600">
                {saving ? '...' : '✅ Créer le projet'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
