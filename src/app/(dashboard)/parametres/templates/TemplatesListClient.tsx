'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Plus, Copy, Trash2 } from 'lucide-react';

interface Template {
  id: string;
  nom: string;
  type: 'JUMELE' | 'MAISON' | 'MULTILOGEMENT';
  actif: boolean;
  etapes: { id: string; nom: string }[];
}

const TYPE_LABEL: Record<string, string> = { JUMELE: 'Jumelé', MAISON: 'Maison', MULTILOGEMENT: 'Multilogement' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Template | null>(null);

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (!res.ok) throw new Error('Erreur chargement templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  // #8-A — Dupliquer : copie structurelle (nom + type + étapes), collision de nom gérée côté serveur.
  const handleDuplicate = async (t: Template) => {
    setBusyId(t.id);
    try {
      const res = await fetch(`/api/templates/${t.id}/duplicate`, { method: 'POST' });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Échec de la duplication'); }
      await loadTemplates();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  // #8-B — Supprimer : DELETE template + ses étapes (cascade). Aucun projet/historique touché.
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      const res = await fetch(`/api/templates/${confirmDelete.id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Échec de la suppression'); }
      setConfirmDelete(null);
      await loadTemplates();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates de cédule</h1>
          <p className="text-gray-600 mt-2">Gérez les templates d'étapes pour chaque type de projet</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouveau template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            Aucun template créé. Les templates par défaut seront créés automatiquement.
          </div>
        ) : (
          templates.map(template => (
            <div key={template.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{template.nom}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-blue-100 text-blue-800">{TYPE_LABEL[template.type] || template.type}</Badge>
                    <span className="text-sm text-gray-600">{template.etapes.length} étapes</span>
                    <span className={`text-sm ${template.actif ? 'text-green-600' : 'text-gray-500'}`}>
                      {template.actif ? '✓ Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/parametres/templates/${template.id}`}>
                    <Button variant="outline" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="outline" className="gap-2" disabled={busyId === template.id} onClick={() => handleDuplicate(template)}>
                    <Copy className="w-4 h-4" />
                    {busyId === template.id ? 'Duplication…' : 'Dupliquer'}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={busyId === template.id}
                    onClick={() => setConfirmDelete(template)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* #8-B — Modal de confirmation de suppression (nomme le template concerné) */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={() => { if (!busyId) setConfirmDelete(null); }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, maxWidth: 460, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="text-lg font-bold text-gray-900">Supprimer le template</h3>
            <p className="text-sm text-gray-600 mt-3">
              Supprimer le template <b>« {confirmDelete.nom} »</b> ({TYPE_LABEL[confirmDelete.type] || confirmDelete.type}, {confirmDelete.etapes.length} étapes)&nbsp;?
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Le template et ses étapes seront supprimés définitivement. Les projets existants et leur historique (cédules, feuilles de temps, dépenses) ne sont <b>pas</b> affectés. Action irréversible.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" disabled={!!busyId} onClick={() => setConfirmDelete(null)}>Annuler</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!!busyId} onClick={handleDelete}>
                {busyId ? 'Suppression…' : 'Supprimer définitivement'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
