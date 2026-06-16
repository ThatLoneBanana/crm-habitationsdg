'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

/* Carnet d'adresses — Clients & Fournisseurs (REF ClientsFournisseurs.jsx).
   Un seul écran combiné : bascule Clients/Fournisseurs + bascule Cartes/Liste.
   Tout le CRUD existant est préservé (mêmes endpoints, mêmes mutations). */

type Data = 'clients' | 'fournisseurs';
type Vue = 'cartes' | 'liste';

interface Projet { id: string; adresse: string; ville?: string; slug?: string; phase?: string }
interface Client { id: string; prenom: string; nom: string; email: string; telephone?: string; projets: Projet[] }
interface Fournisseur { id: string; nom: string; metier: string; email: string; telephone?: string; actif: boolean }

/* — Primitives DG (tokens uniquement) — */
const PHASES: Record<string, { label: string; tint: string; ink: string; bar: string }> = {
  SIGNE:       { label: 'Signé',       tint: 'var(--phase-signe-tint)',       ink: 'var(--phase-signe-ink)',       bar: 'var(--phase-signe-bar)' },
  PREPARATION: { label: 'Préparation', tint: 'var(--phase-preparation-tint)', ink: 'var(--phase-preparation-ink)', bar: 'var(--phase-preparation-bar)' },
  CHANTIER:    { label: 'Chantier',    tint: 'var(--phase-chantier-tint)',    ink: 'var(--phase-chantier-ink)',    bar: 'var(--phase-chantier-bar)' },
  LIVRAISON:   { label: 'Livraison',   tint: 'var(--phase-livraison-tint)',   ink: 'var(--phase-livraison-ink)',   bar: 'var(--phase-livraison-bar)' },
  TERMINE:     { label: 'Terminé',     tint: 'var(--phase-termine-tint)',     ink: 'var(--phase-termine-ink)',     bar: 'var(--phase-termine-bar)' },
};

function PhaseBadge({ phase }: { phase: string | null | undefined }) {
  if (!phase || !PHASES[phase]) return null;
  const p = PHASES[phase];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: p.tint, color: p.ink }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.bar, flex: '0 0 auto' }} />
      {p.label}
    </span>
  );
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((s) => s.charAt(0).toUpperCase()).join('') || '–';
  const d = size === 'sm' ? 22 : 32;
  return (
    <span style={{ width: d, height: d, borderRadius: '50%', background: 'var(--n-200)', color: 'var(--text-secondary)', fontSize: size === 'sm' ? 10 : 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
      {initials}
    </span>
  );
}

function SegmentedControl<T extends string>({ value, onChange, options, size }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; icon: string }[]; size?: 'sm' }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: size === 'sm' ? '4px 9px' : '6px 12px',
            fontSize: size === 'sm' ? 12 : 12.5, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', background: active ? 'var(--surface)' : 'transparent',
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)', boxShadow: active ? 'var(--shadow-sm)' : 'none',
          }}>
            <i className={`ti ti-${o.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Line({ icon, text }: { icon: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0' }}>
      <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 14, color: 'var(--text-tertiary)', flexShrink: 0 }} />
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 26, height: 26, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer',
  color: 'var(--text-tertiary)', fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
const TH: React.CSSProperties = {
  padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', textAlign: 'left',
};
const TD: React.CSSProperties = { padding: '10px 14px', color: 'var(--text-secondary)' };
const inputSt: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
  fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)',
};

export default function CarnetClient({ defaultData = 'clients' }: { defaultData?: Data }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Data>(defaultData);
  const [vue, setVue] = useState<Vue>('cartes');
  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<'nom' | 'prenom' | 'metier'>('nom');

  // CRUD — états des dialogues (préservés)
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', metier: '', actif: true });

  // Fetch des deux listes (mêmes endpoints existants). Logique inchangée.
  useEffect(() => {
    const load = async () => {
      try {
        const [rc, rf] = await Promise.all([fetch('/api/clients'), fetch('/api/fournisseurs')]);
        if (rc.ok) setClients((await rc.json()).clients || []);
        if (rf.ok) setFournisseurs((await rf.json()).fournisseurs || []);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isClients = data === 'clients';

  const clientsFiltres = useMemo(() => {
    const q = recherche.toLowerCase();
    return clients
      .filter((c) => `${c.prenom} ${c.nom}`.toLowerCase().includes(q))
      .sort((a, b) => (tri === 'prenom' ? a.prenom.localeCompare(b.prenom) : a.nom.localeCompare(b.nom)));
  }, [clients, recherche, tri]);

  const fournisseursFiltres = useMemo(() => {
    const q = recherche.toLowerCase();
    return fournisseurs
      .filter((f) => f.nom.toLowerCase().includes(q) || f.metier.toLowerCase().includes(q))
      .sort((a, b) => (tri === 'metier' ? a.metier.localeCompare(b.metier) : a.nom.localeCompare(b.nom)));
  }, [fournisseurs, recherche, tri]);

  const primaryProjet = (c: Client) => c.projets?.[0];
  const openProjet = (c: Client) => {
    const p = primaryProjet(c);
    if (p) router.push(`/projets/${p.slug || p.id}`);
  };

  // — Ouverture des dialogues —
  const openCreate = () => {
    setSelected(null);
    setForm({ prenom: '', nom: '', email: '', telephone: '', metier: '', actif: true });
    setEditOpen(true);
  };
  const openEditClient = (c: Client) => {
    setSelected(c);
    setForm({ prenom: c.prenom, nom: c.nom, email: c.email, telephone: c.telephone || '', metier: '', actif: true });
    setEditOpen(true);
  };
  const openEditFournisseur = (f: Fournisseur) => {
    setSelected(f);
    setForm({ prenom: '', nom: f.nom, email: f.email, telephone: f.telephone || '', metier: f.metier, actif: f.actif });
    setEditOpen(true);
  };
  const openDelete = (item: any) => { setSelected(item); setDeleteOpen(true); };

  // — Mutations (préservées à l'identique) —
  const handleSave = async () => {
    try {
      const isEdit = !!selected;
      let url: string; let body: any;
      if (isClients) {
        url = isEdit ? `/api/clients/${selected.id}` : '/api/clients';
        body = { prenom: form.prenom, nom: form.nom, email: form.email, telephone: form.telephone };
      } else {
        url = isEdit ? `/api/fournisseurs/${selected.id}` : '/api/fournisseurs';
        body = { nom: form.nom, metier: form.metier, email: form.email, telephone: form.telephone, actif: form.actif };
      }
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setEditOpen(false);
        setSelected(null);
        location.reload();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const url = isClients ? `/api/clients/${selected.id}` : `/api/fournisseurs/${selected.id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        setDeleteOpen(false);
        setSelected(null);
        location.reload();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Chargement…</div>;

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Carnet d'adresses</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{clients.length} clients · {fournisseurs.length} fournisseurs</p>
        </div>
        <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', color: '#fff', background: 'var(--dg-red)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          <i className="ti ti-plus" aria-hidden="true" />
          {isClients ? 'Nouveau client' : 'Nouveau fournisseur'}
        </button>
      </div>

      {/* Bascules */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <SegmentedControl<Data> value={data} onChange={setData} options={[{ value: 'clients', label: 'Clients', icon: 'users' }, { value: 'fournisseurs', label: 'Fournisseurs', icon: 'truck' }]} />
        <SegmentedControl<Vue> size="sm" value={vue} onChange={setVue} options={[{ value: 'cartes', label: 'Cartes', icon: 'layout-grid' }, { value: 'liste', label: 'Liste', icon: 'list' }]} />
      </div>

      {/* Recherche + tri */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: 220 }}>
          <i className="ti ti-search" aria-hidden="true" style={{ position: 'absolute', left: 10, fontSize: 15, color: 'var(--text-tertiary)' }} />
          <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder={isClients ? 'Rechercher un client…' : 'Rechercher un fournisseur…'}
            style={{ ...inputSt, height: 36, padding: '0 12px 0 32px' }} />
        </div>
        <select value={tri} onChange={(e) => setTri(e.target.value as any)}
          style={{ height: 36, padding: '0 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <option value="nom">Trier : nom</option>
          {isClients ? <option value="prenom">Trier : prénom</option> : <option value="metier">Trier : métier</option>}
        </select>
      </div>

      {/* — Vue CARTES — */}
      {vue === 'cartes' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {isClients
            ? clientsFiltres.map((c) => {
                const pr = primaryProjet(c);
                return (
                  <div key={c.id} onClick={() => openProjet(c)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 15, cursor: pr ? 'pointer' : 'default' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                      <Avatar name={`${c.prenom} ${c.nom}`} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{c.prenom} {c.nom}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{pr?.ville || 'Aucun projet'}</div>
                      </div>
                      {pr?.phase ? <PhaseBadge phase={pr.phase} /> : null}
                    </div>
                    <Line icon="map-pin" text={pr?.adresse} />
                    <Line icon="mail" text={c.email} />
                    <Line icon="phone" text={c.telephone} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                      <button title="Modifier" onClick={() => openEditClient(c)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-pencil" /></button>
                      <button title="Supprimer" onClick={() => openDelete(c)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-trash" /></button>
                    </div>
                  </div>
                );
              })
            : fournisseursFiltres.map((f) => (
                <div key={f.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-secondary)', flexShrink: 0 }}>
                      <i className="ti ti-tool" aria-hidden="true" style={{ fontSize: 16 }} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{f.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.metier}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: f.actif ? 'var(--success-tint)' : 'var(--n-100)', color: f.actif ? 'var(--success-text)' : 'var(--text-secondary)' }}>{f.actif ? 'Actif' : 'Inactif'}</span>
                  </div>
                  <Line icon="mail" text={f.email} />
                  <Line icon="phone" text={f.telephone} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 8 }}>
                    <button title="Modifier" onClick={() => openEditFournisseur(f)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-pencil" /></button>
                    <button title="Supprimer" onClick={() => openDelete(f)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-trash" /></button>
                  </div>
                </div>
              ))}
          {((isClients && clientsFiltres.length === 0) || (!isClients && fournisseursFiltres.length === 0)) && (
            <div style={{ gridColumn: '1 / -1', padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Aucun résultat</div>
          )}
        </div>
      ) : (
        /* — Vue LISTE — */
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {(isClients
                  ? ['Client', 'Ville', 'Courriel', 'Téléphone', 'Phase', '']
                  : ['Fournisseur', 'Métier', 'Contact', 'Téléphone', 'Statut', '']
                ).map((h, i) => <th key={i} style={{ ...TH, textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {isClients
                ? clientsFiltres.map((c, i) => {
                    const pr = primaryProjet(c);
                    return (
                      <tr key={c.id} onClick={() => openProjet(c)} style={{ borderBottom: i === clientsFiltres.length - 1 ? 'none' : '1px solid var(--divider)', cursor: pr ? 'pointer' : 'default' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-subtle)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={`${c.prenom} ${c.nom}`} size="sm" /><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.prenom} {c.nom}</span></span></td>
                        <td style={TD}>{pr?.ville || '—'}</td>
                        <td style={TD}>{c.email}</td>
                        <td style={{ ...TD, fontVariantNumeric: 'tabular-nums' }}>{c.telephone || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>{pr?.phase ? <PhaseBadge phase={pr.phase} /> : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <span style={{ display: 'inline-flex', gap: 2 }}>
                            <button title="Modifier" onClick={() => openEditClient(c)} style={iconBtn}><i className="ti ti-pencil" /></button>
                            <button title="Supprimer" onClick={() => openDelete(c)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-trash" /></button>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                : fournisseursFiltres.map((f, i) => (
                    <tr key={f.id} style={{ borderBottom: i === fournisseursFiltres.length - 1 ? 'none' : '1px solid var(--divider)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-subtle)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.nom}</td>
                      <td style={TD}>{f.metier}</td>
                      <td style={TD}>{f.email}</td>
                      <td style={{ ...TD, fontVariantNumeric: 'tabular-nums' }}>{f.telephone || '—'}</td>
                      <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: f.actif ? 'var(--success-tint)' : 'var(--n-100)', color: f.actif ? 'var(--success-text)' : 'var(--text-secondary)' }}>{f.actif ? 'Actif' : 'Inactif'}</span></td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <span style={{ display: 'inline-flex', gap: 2 }}>
                          <button title="Modifier" onClick={() => openEditFournisseur(f)} style={iconBtn}><i className="ti ti-pencil" /></button>
                          <button title="Supprimer" onClick={() => openDelete(f)} style={iconBtn} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}><i className="ti ti-trash" /></button>
                        </span>
                      </td>
                    </tr>
                  ))}
              {((isClients && clientsFiltres.length === 0) || (!isClients && fournisseursFiltres.length === 0)) && (
                <tr><td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucun résultat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialogue Créer / Modifier */}
      {editOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,27,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setEditOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 22, maxWidth: 420, width: '100%' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{selected ? 'Modifier' : 'Nouveau'} {isClients ? 'client' : 'fournisseur'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {isClients ? (
                <>
                  <input placeholder="Prénom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} style={inputSt} />
                  <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputSt} />
                  <input placeholder="Courriel" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputSt} />
                  <input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputSt} />
                </>
              ) : (
                <>
                  <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputSt} />
                  <input placeholder="Métier" value={form.metier} onChange={(e) => setForm({ ...form, metier: e.target.value })} style={inputSt} />
                  <input placeholder="Courriel" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputSt} />
                  <input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputSt} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form.actif} onChange={(e) => setForm({ ...form, actif: e.target.checked })} />
                    Fournisseur actif
                  </label>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditOpen(false)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }}>Annuler</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', background: 'var(--dg-red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue Supprimer */}
      {deleteOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,27,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setDeleteOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 22, maxWidth: 420, width: '100%' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Supprimer {isClients ? 'le client' : 'le fournisseur'} ?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>
              Êtes-vous sûr de vouloir supprimer {isClients ? `${selected?.prenom} ${selected?.nom}` : selected?.nom} ?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteOpen(false)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }}>Annuler</button>
              <button onClick={handleDelete} style={{ padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
