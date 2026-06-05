'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TacheDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tache?: any;
  projectId?: string;
  fournisseurs?: any[];
  onSave?: (data: any) => void;
  allTaches?: any[];
  toleranceJours?: number;
}


export function TacheDialog({
  open,
  onOpenChange,
  tache,
  projectId = '',
  fournisseurs = [],
  onSave,
}: TacheDialogProps) {
  const [nom, setNom] = useState(tache?.nom || '');
  const [dateDebut, setDateDebut] = useState(
    tache?.dateDebut ? new Date(tache.dateDebut).toISOString().split('T')[0] : ''
  );
  const [dateFin, setDateFin] = useState(
    tache?.dateFin ? new Date(tache.dateFin).toISOString().split('T')[0] : ''
  );
  const [assigneA, setAssigneA] = useState(tache?.assigneA || '');
  const [visibleClient, setVisibleClient] = useState(tache?.visibleClient || false);
  const [saving, setSaving] = useState(false);

  // Réinitialiser les states quand le dialog s'ouvre ou que tache change
  useEffect(() => {
    if (open) {
      setNom(tache?.nom || '');
      setDateDebut(
        tache?.dateDebut ? new Date(tache.dateDebut).toISOString().split('T')[0] : ''
      );
      setDateFin(
        tache?.dateFin ? new Date(tache.dateFin).toISOString().split('T')[0] : ''
      );
      setAssigneA(tache?.assigneA || '');
      setVisibleClient(tache?.visibleClient || false);
    }
  }, [open, tache]);

  const handleSave = async () => {
    if (!nom || !dateDebut || !dateFin) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const method = tache ? 'PUT' : 'POST';
      const payload = {
        ...(tache && { id: tache.id }),
        projetId: projectId,
        nom,
        dateDebut,
        dateFin,
        assigneA,
        visibleClient,
      };

      const res = await fetch('/api/taches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');

      const data = await res.json();
      onSave?.(data.tache);
      onOpenChange(false);
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tache ? 'Modifier l\'étape' : 'Ajouter une étape'}</DialogTitle>
          <DialogDescription>
            {tache ? 'Modifiez les détails de l\'étape' : 'Créez une nouvelle étape pour ce projet'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'étape *</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="ex: Fondations"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Début *</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin">Fin *</Label>
              <Input
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>

          {/* Assigné à */}
          <div className="space-y-2">
            <Label htmlFor="assigne">Assigné à (fournisseur)</Label>
            <Select value={assigneA || 'none'} onValueChange={(v) => setAssigneA(v === 'none' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                {fournisseurs.map((f) => (
                  <SelectItem key={f.id} value={f.nom}>
                    {f.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visible client */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visibleClient"
              checked={visibleClient}
              onCheckedChange={(checked) => setVisibleClient(checked as boolean)}
            />
            <Label htmlFor="visibleClient">Visible pour le client</Label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
