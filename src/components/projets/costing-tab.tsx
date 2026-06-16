'use client';

import { formatMontant, formatMontantCourt } from '@/lib/utils';
import { BigStat, SANTE_LABEL, santeFromMarge, formatPct } from '@/components/costing/BigStat';

/* Onglet Costing de la fiche projet (REF CostingTab).
   Reçoit l'objet `calculs` de /api/projets/costing — aucun calcul refait ici.
   Adaptation aux données réelles : il n'existe pas de « budget » par catégorie,
   seulement le réel engagé (dépenses + main d'œuvre des feuilles de temps). */

interface Calculs {
  montantContrat: number;
  extrasSignes: number;
  revenues: number;
  depensesMateriaux: number;
  depensesSousTraitants: number;
  depensesEquipement: number;
  depensesAutre: number;
  depensesMainOeuvre: number;
  totalDepenses: number;
  profitNet: number;
  marge: number;
}

export function CostingTab({ calculs }: { calculs: Calculs }) {
  const c = calculs;
  const sante = santeFromMarge(c.marge);
  const depassementRevenus = c.totalDepenses > c.revenues;

  const cats = [
    { nom: 'Matériaux', icon: 'package', montant: c.depensesMateriaux, mo: false },
    { nom: 'Sous-traitants', icon: 'users', montant: c.depensesSousTraitants, mo: false },
    { nom: 'Équipement', icon: 'tool', montant: c.depensesEquipement, mo: false },
    { nom: 'Autre', icon: 'dots-circle-horizontal', montant: c.depensesAutre, mo: false },
    { nom: "Main d'œuvre", icon: 'clock', montant: c.depensesMainOeuvre, mo: true },
  ];
  const maxCat = Math.max(1, ...cats.map((x) => x.montant));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 4 BigStats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <BigStat icon="trending-up" label="Revenus" value={formatMontant(c.revenues, 0)} sub={`contrat ${formatMontantCourt(c.montantContrat)} + extras ${formatMontantCourt(c.extrasSignes)}`} />
        <BigStat icon="trending-down" label="Dépenses engagées" value={formatMontant(c.totalDepenses, 0)} sub="réel à ce jour" />
        <BigStat icon="businessplan" label="Profit projeté" value={formatMontant(c.profitNet, 0)} tone={sante} />
        <BigStat icon="percentage" label="Marge" value={formatPct(c.marge)} tone={sante} sub={SANTE_LABEL[sante]} />
      </div>

      {/* Barre dépenses engagées vs revenus (faute de budget par catégorie) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dépenses engagées</span>
          <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{formatMontant(c.totalDepenses, 0)} / {formatMontant(c.revenues, 0)} revenus</span>
        </div>
        <div style={{ height: 9, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${c.revenues > 0 ? Math.min(100, c.totalDepenses / c.revenues * 100) : 0}%`, background: depassementRevenus ? 'var(--danger)' : 'var(--success)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Dépenses par catégorie */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '11px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
            <i className="ti ti-list-details" aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />
            Dépenses par catégorie
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>réel engagé</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <tbody>
            {cats.map((cat, i) => (
              <tr key={i} style={{ borderBottom: i === cats.length - 1 ? 'none' : '1px solid var(--divider)', background: cat.mo ? 'var(--surface-subtle)' : 'transparent' }}>
                <td style={{ padding: '9px 14px', width: 30 }}>
                  <i className={`ti ti-${cat.icon}`} aria-hidden="true" style={{ fontSize: 16, color: cat.mo ? 'var(--info)' : 'var(--text-tertiary)' }} />
                </td>
                <td style={{ padding: '9px 14px', fontWeight: cat.mo ? 600 : 500, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                  {cat.nom}
                  {cat.mo ? (
                    <span style={{ marginLeft: 7, display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-full)', background: 'var(--info-tint)', color: 'var(--info-text)' }}>feuilles de temps</span>
                  ) : null}
                </td>
                <td style={{ padding: '9px 14px', width: '40%' }}>
                  <div style={{ height: 6, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round(cat.montant / maxCat * 100)}%`, background: cat.mo ? 'var(--info)' : 'var(--n-400)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{formatMontant(cat.montant, 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--surface-subtle)' }}>
              <td />
              <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>Total</td>
              <td />
              <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--text-primary)' }}>{formatMontant(c.totalDepenses, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
