'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/dg';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, GripVertical, ArrowLeft } from 'lucide-react';

interface TemplateEtape {
  id: string;
  nom: string;
  ordre: number;
  joursDefaut: number;
  assigneA?: string | null;
  visibleClient: boolean;
  interne: boolean;
}

interface Template {
  id: string;
  nom: string;
  type: 'JUMELE' | 'MAISON' | 'MULTILOGEMENT';
  etapes: TemplateEtape[];
}

const COLS = '24px 28px 1fr 90px 1fr 92px 70px 36px';

export default function TemplateEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [etapes, setEtapes] = useState<TemplateEtape[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${id}`);
        if (!res.ok) throw new Error('Template non trouvé');
        const data = await res.json();
        setTemplate(data.template);
        setEtapes(data.template.etapes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handleDragStart = (idx: number) => setDraggedItem(idx);
  const handleDragOver = (idx: number) => {
    if (draggedItem === null || draggedItem === idx) return;
    const next = [...etapes];
    const [moved] = next.splice(draggedItem, 1);
    next.splice(idx, 0, moved);
    setEtapes(next);
    setDraggedItem(idx);
  };

  const updateEtape = (idx: number, field: keyof TemplateEtape, value: any) => {
    setEtapes(etapes.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };
  const deleteEtape = (idx: number) => setEtapes(etapes.filter((_, i) => i !== idx));
  const addEtape = () =>
    setEtapes([
      ...etapes,
      { id: `new-${Date.now()}`, nom: 'Nouvelle étape', ordre: etapes.length + 1, joursDefaut: 1, assigneA: '', visibleClient: true, interne: false },
    ]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Erreur lors de la sauvegarde');
      }
      setSuccess('Template sauvegardé');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--text-secondary)' }}>Chargement...</div>;
  if (!template) return <div style={{ padding: 24, color: 'var(--text-secondary)' }}>Template non trouvé</div>;

  const typeLabel = template.type === 'JUMELE' ? 'Jumelé' : template.type === 'MAISON' ? 'Maison' : 'Multilogement';

  return (
    <div style={{ padding: 24, maxWidth: 1000 }}>
      <button onClick={() => router.push('/parametres/templates')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Templates
      </button>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>Éditer : {template.nom}</h1>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, marginBottom: 20 }}>
        Type : {typeLabel} · {etapes.length} étape{etapes.length > 1 ? 's' : ''}
      </p>

      {error && <div style={{ background: 'var(--danger-tint)', color: 'var(--danger-text)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ background: 'var(--success-tint)', color: 'var(--success-text)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 12 }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, alignItems: 'center', padding: '0 10px 6px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
        <span></span><span>#</span><span>Étape</span><span>Durée (j)</span><span>Corps de métier</span><span style={{ textAlign: 'center' }}>Visible client</span><span style={{ textAlign: 'center' }}>Interne</span><span></span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {etapes.map((etape, idx) => (
          <div
            key={etape.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => { e.preventDefault(); handleDragOver(idx); }}
            onDrop={() => setDraggedItem(null)}
            style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, alignItems: 'center', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', opacity: draggedItem === idx ? 0.5 : 1, cursor: 'move' }}
          >
            <GripVertical size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{idx + 1}</span>
            <Input value={etape.nom} onChange={(e) => updateEtape(idx, 'nom', e.target.value)} />
            <Input type="number" min={1} value={etape.joursDefaut} onChange={(e) => updateEtape(idx, 'joursDefaut', parseInt(e.target.value, 10) || 1)} />
            <Input value={etape.assigneA ?? ''} placeholder="Interne" onChange={(e) => updateEtape(idx, 'assigneA', e.target.value)} />
            <span style={{ textAlign: 'center' }}>
              <input type="checkbox" checked={etape.visibleClient} onChange={(e) => updateEtape(idx, 'visibleClient', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--dg-red)', cursor: 'pointer' }} />
            </span>
            <span style={{ textAlign: 'center' }}>
              <input type="checkbox" checked={etape.interne} onChange={(e) => updateEtape(idx, 'interne', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--dg-red)', cursor: 'pointer' }} />
            </span>
            <button onClick={() => deleteEtape(idx)} title="Supprimer" style={{ padding: 6, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={addEtape} variant="outline" style={{ width: '100%', marginTop: 12 }}>
        <Plus className="w-4 h-4" /> Ajouter une étape
      </Button>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button variant="outline" onClick={() => router.push('/parametres/templates')}>Annuler</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
      </div>
    </div>
  );
}
