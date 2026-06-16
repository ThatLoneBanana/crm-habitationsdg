'use client';

// Primitives du design system DG (token inline), modelées sur les patterns de
// DashboardClient / Costing / onglet Accès. NAMESPACE DISTINCT de components/ui
// (shadcn/Tailwind) : ne pas mélanger. Aucune couleur en dur, aucune ombre au
// repos — bordures + tokens DG uniquement.

import React from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle ? <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, icon, action }: { title: string; icon?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '11px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
        {icon ? <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} /> : null}
        {title}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, htmlFor, children, style }: { label: string; htmlFor?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label htmlFor={htmlFor} style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

const fieldBase: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
  fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', background: 'var(--surface)',
};

export function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldBase, ...(props.disabled ? { background: 'var(--surface-subtle)', color: 'var(--text-secondary)' } : {}), ...style }} />;
}

export function Select({ style, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...fieldBase, cursor: 'pointer', ...style }}>{children}</select>;
}

type ButtonVariant = 'primary' | 'outline' | 'danger';
export function Button({ variant = 'primary', style, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base: React.CSSProperties = {
    padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)',
    cursor: props.disabled ? 'not-allowed' : 'pointer', opacity: props.disabled ? 0.6 : 1, border: '1px solid transparent',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
  };
  // Primaire = rouge DG (un seul par vue). Le vert n'est JAMAIS un bouton primaire.
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: 'var(--dg-red)', color: '#fff' },
    outline: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    danger: { background: 'var(--surface)', color: 'var(--danger-text)', border: '1px solid var(--danger)' },
  };
  return <button {...props} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export function Badge({ tone = 'neutral', children, style }: { tone?: Tone; children: React.ReactNode; style?: React.CSSProperties }) {
  const tones: Record<Tone, React.CSSProperties> = {
    success: { background: 'var(--success-tint)', color: 'var(--success-text)' },
    danger: { background: 'var(--danger-tint)', color: 'var(--danger-text)' },
    warning: { background: 'var(--warning-tint)', color: 'var(--warning-text)' },
    info: { background: 'var(--info-tint)', color: 'var(--info-text)' },
    neutral: { background: 'var(--n-100)', color: 'var(--text-secondary)' },
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', ...tones[tone], ...style }}>
      {children}
    </span>
  );
}

// Bannières d'état (erreur / succès) — tints DG.
export function Banner({ tone, children }: { tone: 'danger' | 'success'; children: React.ReactNode }) {
  const t = tone === 'danger'
    ? { background: 'var(--danger-tint)', color: 'var(--danger-text)' }
    : { background: 'var(--success-tint)', color: 'var(--success-text)' };
  return <div style={{ ...t, padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 16 }}>{children}</div>;
}

// Styles de tableau DG (en-tête majuscule tertiaire, cellules denses).
export const dgTH: React.CSSProperties = { padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', textAlign: 'left' };
export const dgTD: React.CSSProperties = { padding: '11px 14px', fontSize: 13, color: 'var(--text-primary)' };
