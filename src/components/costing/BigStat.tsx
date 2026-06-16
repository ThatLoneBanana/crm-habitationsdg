import React from 'react';

/* Composant partagé Costing (global + onglet projet). Tokens DG uniquement. */

export type Sante = 'success' | 'warning' | 'danger';

export const SANTE_COLOR: Record<Sante, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
};
export const SANTE_LABEL: Record<Sante, string> = {
  success: 'Saine',
  warning: 'À surveiller',
  danger: 'Sous pression',
};

// Seuils de santé EXISTANTS (réutilisés, non inventés) : marge ≥ 20 % saine,
// ≥ 10 % à surveiller, sinon sous pression.
export function santeFromMarge(marge: number): Sante {
  if (marge >= 20) return 'success';
  if (marge >= 10) return 'warning';
  return 'danger';
}

// Marge (déjà en pourcentage) → « 23,5 % »
export const formatPct = (marge: number) => `${marge.toFixed(1).replace('.', ',')} %`;

export function BigStat({ label, value, tone, icon, sub }: { label: string; value: React.ReactNode; tone?: Sante; icon: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '15px 17px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
        <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-tertiary)' }} />
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.018em', color: tone ? SANTE_COLOR[tone] : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub ? <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{sub}</div> : null}
    </div>
  );
}
