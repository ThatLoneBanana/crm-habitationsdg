'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Bottombar mobile (< md). Masquée >= md (la sidebar prend le relais). Tokens DG,
// icônes Tabler, onglet actif = var(--dg-red) (item de nav actif, autorisé).
// 5 emplacements : 4 destinations + « Plus » (sheet vers les vues secondaires).
// Gating : parité sidebar = on affiche tout ; l'enforcement reste les gardes de
// route (requirePageCapability). Le masquage par capacité = lot séparé.

const BAR_H = 56;

// 3 onglets primaires (Carte déplacée dans le menu hamburger).
const NAV: { href: string; label: string; icon: string }[] = [
  { href: '/', label: 'Tableau', icon: 'ti-layout-dashboard' },
  { href: '/projets', label: 'Projets', icon: 'ti-building-community' },
  { href: '/notes', label: 'Notes', icon: 'ti-notes' },
];

// Menu hamburger (4e emplacement) : Carte + vues secondaires.
const PLUS: { href: string; label: string; icon: string }[] = [
  { href: '/map', label: 'Carte', icon: 'ti-map-2' },
  { href: '/clients', label: 'Clients', icon: 'ti-users' },
  { href: '/fournisseurs', label: 'Fournisseurs', icon: 'ti-truck' },
  { href: '/costing', label: 'Costing', icon: 'ti-chart-bar' },
  { href: '/feuilles-de-temps', label: 'Feuilles de temps', icon: 'ti-clock' },
  { href: '/parametres', label: 'Paramètres', icon: 'ti-settings' },
];

const estActif = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

function Item({ active, label, icon, onClick, href }: { active: boolean; label: string; icon: string; onClick?: () => void; href?: string }) {
  const contenu = (
    <>
      <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 20 }} />
      <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, lineHeight: 1 }}>{label}</span>
    </>
  );
  const style: React.CSSProperties = {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
    height: BAR_H, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'none',
    color: active ? 'var(--dg-red)' : 'var(--text-tertiary)',
  };
  return href
    ? <Link href={href} style={style} aria-current={active ? 'page' : undefined}>{contenu}</Link>
    : <button onClick={onClick} style={style} aria-current={active ? 'page' : undefined}>{contenu}</button>;
}

export default function Bottombar() {
  const pathname = usePathname();
  const [plusOuvert, setPlusOuvert] = useState(false);
  const plusActif = PLUS.some((p) => estActif(pathname, p.href));

  return (
    <div className="md:hidden">
      {/* Sheet « Plus » */}
      {plusOuvert && (
        <>
          <div
            onClick={() => setPlusOuvert(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 60 }}
          />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: BAR_H, zIndex: 61, background: 'var(--surface)', borderTop: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '6px 0' }}>
            {PLUS.map((p) => {
              const active = estActif(pathname, p.href);
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setPlusOuvert(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', textDecoration: 'none', color: active ? 'var(--dg-red)' : 'var(--text-primary)', fontSize: 14, fontWeight: active ? 600 : 500 }}
                >
                  <i className={`ti ${p.icon}`} aria-hidden="true" style={{ fontSize: 19, color: active ? 'var(--dg-red)' : 'var(--text-secondary)' }} />
                  {p.label}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Barre */}
      <nav style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: BAR_H, zIndex: 62, display: 'flex', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        {NAV.map((n) => (
          <Item key={n.href} href={n.href} label={n.label} icon={n.icon} active={estActif(pathname, n.href)} />
        ))}
        <Item label="Menu" icon="ti-menu-2" active={plusActif || plusOuvert} onClick={() => setPlusOuvert((v) => !v)} />
      </nav>
    </div>
  );
}
