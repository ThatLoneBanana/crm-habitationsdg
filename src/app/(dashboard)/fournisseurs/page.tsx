'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Mail, Phone, Zap } from 'lucide-react';

interface Fournisseur {
  id: string;
  nom: string;
  metier?: string;
  email?: string;
  telephone?: string;
  actif: boolean;
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nom: '', metier: '', email: '', telephone: '', actif: true });

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const res = await fetch('/api/fournisseurs');
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setFournisseurs(data.fournisseurs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/fournisseurs/${editingId}` : '/api/fournisseurs';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erreur');
      setDialogOpen(false);
      setEditingId(null);
      setFormData({ nom: '', metier: '', email: '', telephone: '', actif: true });
      fetchFournisseurs();
    } catch (err) {
      alert('Erreur: ' + (err as Error).message);
    }
  };

  const handleEdit = (f: Fournisseur) => {
    setFormData({ nom: f.nom, metier: f.metier || '', email: f.email || '', telephone: f.telephone || '', actif: f.actif });
    setEditingId(f.id);
    setDialogOpen(true);
  };

  const handleToggle = async (f: Fournisseur) => {
    try {
      const res = await fetch(`/api/fournisseurs/${f.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, actif: !f.actif }),
      });
      if (!res.ok) throw new Error('Erreur');
      fetchFournisseurs();
    } catch (err) {
      alert('Erreur');
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({ nom: '', metier: '', email: '', telephone: '', actif: true });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  const actifs = fournisseurs.filter(f => f.actif).length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
          <p className="text-gray-600 mt-2">{actifs} actifs sur {fournisseurs.length}</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Ajouter fournisseur
        </Button>
      </div>

      <div className="space-y-3">
        {fournisseurs.map((f) => (
          <div key={f.id} className="border rounded-lg p-4 bg-white flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{f.nom}</h3>
              <p className="text-sm text-gray-600 mt-1">{f.metier}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                {f.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{f.email}</div>}
                {f.telephone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{f.telephone}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleToggle(f)} className={`p-2 rounded ${f.actif ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                <Zap className="w-4 h-4" />
              </button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(f)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Éditer fournisseur' : 'Ajouter fournisseur'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label htmlFor="nom">Nom *</Label><Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} /></div>
            <div><Label htmlFor="metier">Métier</Label><Input id="metier" value={formData.metier} onChange={(e) => setFormData({ ...formData, metier: e.target.value })} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div><Label htmlFor="telephone">Téléphone</Label><Input id="telephone" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Annuler</Button>
            <Button onClick={handleSave} disabled={!formData.nom} className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
