'use client'
import { useRouter } from 'next/navigation'

function formatMontant(n: number): string {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M$`
  if (n >= 1000) return `${(n/1000).toFixed(0)}k$`
  return `${n}$`
}

function phaseConfig(phase: string) {
  const config: Record<string, { label: string; bg: string; text: string; bar: string }> = {
    SIGNE: { label: 'Signé', bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
    PREPARATION: { label: 'Préparation', bg: '#EEEDFE', text: '#3C3489', bar: '#7F77DD' },
    CHANTIER: { label: 'Chantier', bg: '#FAEEDA', text: '#854F0B', bar: '#EF9F27' },
    LIVRAISON: { label: 'Livraison', bg: '#EAF3DE', text: '#3B6D11', bar: '#639922' },
    TERMINE: { label: 'Terminé', bg: '#F1EFE8', text: '#5F5E5A', bar: '#B4B2A9' },
  }
  return config[phase] || config['SIGNE']
}

export default function DashboardClient({
  projetsActifs, livraisonsCeMois, montantTotal,
  alertes, agendaSemaine, projets,
  extrasNonSignes, montantExtrasNonSignes,
  paiementsAttendus, montantPaiementsAttendus,
  prenomUser
}: any) {
  const router = useRouter()
  const now = new Date()
  const joursLabels = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const moisLabels = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

  return (
    <div style={{ padding: '0 24px' }}>
      {/* En-tête */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 500 }}>Bonjour {prenomUser} 👋</h1>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
          {joursLabels[now.getDay()]} {now.getDate()} {moisLabels[now.getMonth()]} {now.getFullYear()}
          {' — '}{projetsActifs} projets actifs en cours
        </p>
      </div>

      {/* Métriques — 5 colonnes avec cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '20px', paddingTop: '24px' }}>
        {[
          { label: 'Projets actifs', val: projetsActifs, sub: `${livraisonsCeMois} livraison(s) ce mois`, icon: 'ti-building-community', color: '#000' },
          { label: 'En chantier', val: formatMontant(montantTotal), sub: 'valeur totale active', icon: 'ti-currency-dollar', color: '#1D9E75' },
          { label: 'Alertes', val: alertes.length, sub: alertes.filter((a:any)=>a.type==='urgent').length + ' urgente(s)', icon: 'ti-alert-triangle', color: alertes.length > 0 ? '#DC2626' : '#000' },
          { label: 'Extras non signés', val: extrasNonSignes, sub: `${formatMontant(montantExtrasNonSignes)} à confirmer`, icon: 'ti-receipt', color: extrasNonSignes > 0 ? '#D97706' : '#000' },
          { label: 'Paiements attendus', val: paiementsAttendus, sub: `${formatMontant(montantPaiementsAttendus)} à recevoir`, icon: 'ti-cash', color: paiementsAttendus > 0 ? '#2563EB' : '#000' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className={`ti ${m.icon}`} aria-hidden="true" style={{ fontSize: '13px' }}></i>
              {m.label}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 500, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Grid principal — 1fr gauche, 340px droite */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* COLONNE GAUCHE — Alertes + Agenda */}
        <div>
          {/* Alertes */}
          {alertes.length > 0 && (
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ padding: '10px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-bell" aria-hidden="true" style={{ fontSize: '14px', color: '#DC2626' }}></i>
                Alertes prioritaires
              </div>
              {alertes.map((a: any, i: number) => (
                <div key={i}
                  onClick={() => router.push(`/projets/${a.projetId}`)}
                  style={{ padding: '10px 14px', borderBottom: i < alertes.length-1 ? '1px solid #F3F4F6' : 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.type === 'urgent' ? '#DC2626' : '#F59E0B', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.titre}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '1px' }}>{a.sous}</div>
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: a.type === 'urgent' ? '#FEE2E2' : '#FEF3C7', color: a.type === 'urgent' ? '#991B1B' : '#92400E', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.badge}</span>
                </div>
              ))}
            </div>
          )}

          {/* Agenda */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-calendar-week" aria-hidden="true" style={{ fontSize: '14px', color: '#2563EB' }}></i>
                Agenda de la semaine
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>
                {agendaSemaine.reduce((s: number, j: any) => s + j.etapes.length, 0)} étapes
              </span>
            </div>
            {agendaSemaine.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>
                Aucune étape planifiée cette semaine
              </div>
            ) : agendaSemaine.map((jour: any, ji: number) => (
              <div key={ji}>
                <div style={{ padding: '6px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 500, color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{jour.label}</span>
                  <span>{jour.etapes.length} étape{jour.etapes.length > 1 ? 's' : ''}</span>
                </div>
                {jour.etapes.map((e: any, ei: number) => (
                  <div key={ei}
                    onClick={() => router.push(`/projets/${e.projetSlug}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderBottom: ei < jour.etapes.length-1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer' }}
                    onMouseEnter={e2 => (e2.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e2 => (e2.currentTarget.style.background = 'white')}
                  >
                    <div style={{ width: '3px', height: '30px', borderRadius: '2px', background: phaseConfig(e.phase).bar, flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500 }}>{e.nom}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.projet} · {e.client}</div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#F3F4F6', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{e.assigneA}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE — Projets */}
        <div style={{ width: '340px', flexShrink: 0 }}>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ti ti-list" aria-hidden="true" style={{ fontSize: '14px' }}></i>
              Tous les projets
            </div>
            {projets.map((p: any, i: number) => (
              <div key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: i < projets.length-1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer' }}
                onClick={() => router.push(`/projets/${p.slug || p.id}`)}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{p.client.prenom} {p.client.nom}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{p.adresse}</div>
                  {p.prochaineEtape && (
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>↳ {p.prochaineEtape.nom}</div>
                  )}
                  <div style={{ height: '3px', background: '#F3F4F6', borderRadius: '2px', marginTop: '4px' }}>
                    <div style={{ height: '100%', width: `${p.avancement}%`, background: phaseConfig(p.phase).bar, borderRadius: '2px' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: phaseConfig(p.phase).bg, color: phaseConfig(p.phase).text, fontWeight: 500 }}>{phaseConfig(p.phase).label}</span>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{p.avancement}%</div>
                  {p.joursRestants !== null && (
                    <div style={{ fontSize: '10px', color: p.joursRestants <= 14 ? '#DC2626' : '#15803D', marginTop: '1px' }}>{p.joursRestants}j</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
