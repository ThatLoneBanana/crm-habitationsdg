'use client';

import { useEffect, useState, use } from 'react';
import { formatMontant } from '@/lib/utils';
import { calculateTaskStatus } from '@/lib/task-status';

/* Vue client publique — mobile-first, lecture seule (REF VueClient.jsx).
   Données via l'API PUBLIQUE filtrée /api/projets-by-slug uniquement.
   Aucune donnée interne/financière sensible n'est demandée ni affichée
   au-delà de ce que l'API expose déjà (sécurité Cat1-R3 intacte). */

// Statut d'étape (par dates) → libellé + couleur de la timeline.
const STATUT: Record<string, { label: string; color: string }> = {
  completed:   { label: 'Terminé',  color: 'var(--task-termine)' },
  inProgress:  { label: 'En cours', color: 'var(--task-encours)' },
  preparation: { label: 'Bientôt',  color: 'var(--task-demain)' },
  noneStarted: { label: 'À venir',  color: 'var(--task-avenir)' },
};
const statutOf = (t: any): string => calculateTaskStatus(t.dateDebut, t.dateFin).status || 'noneStarted';

const dateCourt = (d: Date | string) =>
  new Date(d).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 20px 40px', background: 'var(--bg-canvas)', minHeight: '100vh' }}>
      <div style={{ width: 390, maxWidth: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', alignSelf: 'flex-start' }}>
        {children}
      </div>
    </div>
  );
}

export default function VueClientPage({ params: paramPromise }: { params: Promise<{ token: string }> }) {
  const params = use(paramPromise);
  const [projet, setProjet] = useState<any>(null);
  const [parametres, setParametres] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unique de l'API publique filtrée — logique de données inchangée.
  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const res = await fetch(`/api/projets-by-slug?slug=${params.token}`);
        if (!res.ok) throw new Error('Projet non trouvé');
        const data = await res.json();
        if (!data.projet) throw new Error('Projet non trouvé');
        setProjet(data.projet);
        setParametres(data.parametres || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjet();
  }, [params.token]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', color: 'var(--text-secondary)', fontSize: 13 }}>Chargement…</div>;
  }
  if (error || !projet) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', color: 'var(--danger)', fontSize: 13 }}>Erreur : {error}</div>;
  }

  // Calculs (présentation) — préservés tels quels.
  const tachesClient = projet.taches.filter((t: any) => t.visibleClient);
  const sched = [...tachesClient].sort(
    (a: any, b: any) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  );
  const done = sched.filter((t: any) => statutOf(t) === 'completed').length;
  const avancement = sched.length > 0 ? Math.round((done / sched.length) * 100) : 0;
  const next =
    sched.find((t: any) => statutOf(t) === 'inProgress') ||
    sched.find((t: any) => statutOf(t) === 'preparation') ||
    sched.find((t: any) => statutOf(t) === 'noneStarted');

  const jr = projet.dateLivraison
    ? Math.ceil((new Date(projet.dateLivraison).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const extrasSignes = projet.extras.filter((e: any) => e.statut === 'SIGNE');
  const totalExtrasSignes = extrasSignes.reduce((s: number, e: any) => s + Number(e.montant), 0);
  const totalRecu = projet.paiements.filter((p: any) => p.recu).reduce((s: number, p: any) => s + Number(p.montant), 0);
  const totalPlanifie = projet.paiements.reduce((s: number, p: any) => s + Number(p.montant), 0);

  const nomCompagnie = parametres?.nomCompagnie ?? 'Habitations DG';
  const siteWeb = parametres?.siteWeb ?? 'habitations-dg.com';

  return (
    <PhoneFrame>
      {/* En-tête de marque */}
      <div style={{ background: 'var(--n-900)', color: '#fff', padding: '16px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Logo blanc dédié (habitationsdg-blanc.svg) sur le bandeau foncé --n-900.
              Hauteur seule → aspect préservé, aucun étirement. Local à cet écran. */}
          <img src="/habitationsdg-blanc.svg" alt="Habitations DG" style={{ height: 30 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 9px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>Espace client</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, opacity: 0.7 }}>Votre projet</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>{projet.adresse}</div>
          <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>{projet.ville}</div>
        </div>
      </div>

      {/* Bloc statut */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--divider)' }}>
        {jr !== null && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: jr <= 14 ? 'var(--danger)' : 'var(--success-text)', fontVariantNumeric: 'tabular-nums' }}>
              {jr > 0 ? `Livraison dans ${jr} jours` : jr === 0 ? "Livraison aujourd'hui" : 'Livré'}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
          <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.018em', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{avancement}%</span>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>complété · {done}/{sched.length} étapes</span>
        </div>
        <div style={{ height: 6, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${avancement}%`, background: 'var(--task-encours)', borderRadius: 'var(--radius-full)' }} />
        </div>
        {next && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 12px', background: 'var(--info-tint)', borderRadius: 'var(--radius-md)' }}>
            <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 16, color: 'var(--info)' }} />
            <div style={{ fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Prochaine étape :</span> <b style={{ fontWeight: 600 }}>{next.nom}</b>
            </div>
          </div>
        )}
      </div>

      {/* Timeline des étapes visibles client */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 10 }}>Étapes de votre construction</div>
        <div style={{ position: 'relative', paddingLeft: 18 }}>
          <div style={{ position: 'absolute', left: 4, top: 6, bottom: 6, width: 2, background: 'var(--divider)' }} />
          {sched.map((t: any, i: number) => {
            const st = statutOf(t);
            const c = STATUT[st]?.color ?? 'var(--task-avenir)';
            return (
              <div key={t.id ?? i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0' }}>
                <span style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: c, border: '2px solid var(--surface)', boxShadow: `0 0 0 1.5px ${c}` }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: st === 'noneStarted' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{t.nom}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{dateCourt(t.dateDebut)} – {dateCourt(t.dateFin)}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: c, whiteSpace: 'nowrap' }}>{STATUT[st]?.label ?? 'À venir'}</span>
              </div>
            );
          })}
          {sched.length === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '6px 0' }}>La cédule de votre projet sera bientôt disponible.</div>
          )}
        </div>
      </div>

      {/* Travaux additionnels signés (info client déjà exposée par l'API) */}
      {extrasSignes.length > 0 && (
        <div style={{ padding: '4px 18px 14px', borderTop: '1px solid var(--divider)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', margin: '12px 0 10px' }}>Travaux additionnels signés</div>
          {extrasSignes.map((e: any) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 0', fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-primary)' }}>{e.description}</span>
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--success-text)', whiteSpace: 'nowrap' }}>{formatMontant(Number(e.montant))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0 0', marginTop: 4, borderTop: '1px solid var(--divider)', fontSize: 12.5, fontWeight: 600 }}>
            <span>Total</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--success-text)' }}>{formatMontant(totalExtrasSignes)}</span>
          </div>
        </div>
      )}

      {/* Échéancier de paiement (info client déjà exposée par l'API) */}
      {projet.paiements.length > 0 && (
        <div style={{ padding: '4px 18px 14px', borderTop: '1px solid var(--divider)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', margin: '12px 0 10px' }}>Échéancier de paiement</div>
          {projet.paiements.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 0', fontSize: 12.5 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', flex: '0 0 auto', background: p.recu ? 'var(--success)' : 'var(--warning)' }} />
                <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</span>
              </span>
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: p.recu ? 'var(--success-text)' : 'var(--text-primary)', whiteSpace: 'nowrap' }}>{formatMontant(Number(p.montant))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0 0', marginTop: 4, borderTop: '1px solid var(--divider)', fontSize: 12.5, fontWeight: 600 }}>
            <span>Reçu à ce jour</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatMontant(totalRecu)} / {formatMontant(totalPlanifie)}</span>
          </div>
        </div>
      )}

      {/* Pied — contact */}
      <div style={{ padding: '14px 18px 18px', borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Une question sur votre projet&nbsp;?</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 3, color: 'var(--text-primary)' }}>{nomCompagnie}</div>
        <a href={`https://${siteWeb}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--info-text)', textDecoration: 'none' }}>{siteWeb}</a>
      </div>
    </PhoneFrame>
  );
}
