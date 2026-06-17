'use client';

import { useState } from 'react';

// Panneau Notes / to-do (privé par utilisateur). Extrait de DashboardClient pour
// être réutilisable (rail dashboard ET route /notes mobile). Embarque les petites
// primitives DG dont il dépend (Card/CardHeader/Row) — rendu identique au tableau
// de bord. Mutations via /api/notes avec maj OPTIMISTE (pas de router.refresh).

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ icon, iconColor, title, action }: { icon: string; iconColor?: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
        <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: iconColor ?? 'var(--text-secondary)' }}></i>
        {title}
      </span>
      {action ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{action}</span> : null}
    </div>
  );
}

function Row({ children, onClick, last }: { children: React.ReactNode; onClick?: () => void; last?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ borderBottom: last ? 'none' : '1px solid var(--divider)', background: hover ? 'var(--surface-subtle)' : 'transparent', cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-fast)' }}
    >
      {children}
    </div>
  );
}

export function NotesPanel({ notesInitiales, projets }: { notesInitiales: any[]; projets: any[] }) {
  const [notes, setNotes] = useState<any[]>(notesInitiales);
  const [contenu, setContenu] = useState('');
  const [projetId, setProjetId] = useState('');
  const [busy, setBusy] = useState(false);

  const triees = [...notes].sort((a, b) => {
    if (a.fait !== b.fait) return a.fait ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const ajouter = async () => {
    const txt = contenu.trim();
    if (!txt || busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenu: txt, projetId: projetId || null }),
      });
      if (!res.ok) throw new Error();
      const { note } = await res.json();
      setNotes((prev) => [note, ...prev]);
      setContenu(''); setProjetId('');
    } catch {
      alert("Erreur lors de l'ajout de la note.");
    } finally {
      setBusy(false);
    }
  };

  const basculer = async (note: any) => {
    const cible = !note.fait;
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, fait: cible } : n)));
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fait: cible }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, fait: !cible } : n)));
    }
  };

  const supprimer = async (note: any) => {
    const snapshot = notes;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      setNotes(snapshot);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 12.5, padding: '7px 9px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)', resize: 'vertical',
  };
  const nbAFaire = notes.filter((n) => !n.fait).length;

  return (
    <Card>
      <CardHeader icon="ti-notes" title="Notes" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{nbAFaire} à faire</span>} />

      {/* Ajout */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Nouvelle note…"
          rows={2}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={projetId} onChange={(e) => setProjetId(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
            <option value="">Sans projet</option>
            {projets.map((p) => (
              <option key={p.id} value={p.id}>{p.ville ? `${p.adresse}, ${p.ville}` : p.adresse}</option>
            ))}
          </select>
          <button
            onClick={ajouter}
            disabled={busy || !contenu.trim()}
            style={{ fontSize: 12, fontWeight: 500, padding: '0 12px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--text-primary)', color: 'var(--surface)', cursor: busy || !contenu.trim() ? 'not-allowed' : 'pointer', opacity: busy || !contenu.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste */}
      {triees.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>Aucune note.</div>
      ) : triees.map((n, i) => (
        <Row key={n.id} last={i === triees.length - 1}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 14px' }}>
            <input
              type="checkbox"
              checked={n.fait}
              onChange={() => basculer(n)}
              style={{ marginTop: 2, cursor: 'pointer', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: n.fait ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: n.fait ? 'line-through' : 'none' }}>
                {n.contenu}
              </div>
              {n.projet ? (
                <div style={{ marginTop: 4 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 500, padding: '2px 7px', borderRadius: 'var(--radius-full)', background: 'var(--n-100)', color: 'var(--text-secondary)', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <i className="ti ti-home" aria-hidden="true" style={{ fontSize: 11 }} />
                    {n.projet.ville ? `${n.projet.adresse}, ${n.projet.ville}` : n.projet.adresse}
                  </span>
                </div>
              ) : null}
            </div>
            <button
              onClick={() => supprimer(n)}
              title="Supprimer"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: 2, flexShrink: 0 }}
            >
              <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 14 }} />
            </button>
          </div>
        </Row>
      ))}
    </Card>
  );
}
