'use client';

import { useState } from 'react';
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

interface ExtraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extra?: any;
  fournisseurs?: any[];
  onSave?: (data: any) => void;
}

export function ExtraDialog({
  open,
  onOpenChange,
  extra,
  fournisseurs = [],
  onSave,
}: ExtraDialogProps) {
  const [description, setDescription] = useState(extra?.description || '');
  const [montant, setMontant] = useState(extra?.montant?.toString() || '');
  const [fournisseur, setFournisseur] = useState(extra?.fournisseur || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description || !montant) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const data = {
        description,
        montant: parseFloat(montant),
        fournisseur,
      };

      onSave?.(data);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{extra ? 'Éditer extra' : 'Ajouter un extra'}</DialogTitle>
          <DialogDescription>
            {extra ? 'Modifiez les détails de l\'extra' : 'Créez un nouvel extra pour ce projet'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Cuisine haut de gamme"
            />
          </div>

          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="montant">Montant ($) *</Label>
            <Input
              id="montant"
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="ex: 18000"
              step="0.01"
            />
          </div>

          {/* Fournisseur */}
          <div className="space-y-2">
            <Label htmlFor="fournisseur">Fournisseur</Label>
            <Select value={fournisseur || 'none'} onValueChange={(v) => setFournisseur(v === 'none' ? '' : v)}>
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
