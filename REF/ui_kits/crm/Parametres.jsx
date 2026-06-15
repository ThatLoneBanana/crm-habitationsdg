/* Écran — Paramètres : onglets selon rôle (Général, Mon compte, Utilisateurs) + Journal. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { Card, CardHeader, Badge, Avatar, Toggle, Button, Input, Tabs } = NS;

  function Row({ label, hint, children }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 0', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
          {hint ? <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{hint}</div> : null}
        </div>
        <div style={{ flexShrink: 0 }}>{children}</div>
      </div>
    );
  }

  function Parametres() {
    const DGd = window.DG;
    const [tab, setTab] = React.useState('general');
    const [t1, setT1] = React.useState(true), [t2, setT2] = React.useState(true), [t3, setT3] = React.useState(false);

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 900 }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Paramètres</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Connecté comme <b>Nicolas Savard</b> · <Badge tone="danger">Admin</Badge></p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <Tabs value={tab} onChange={setTab} tabs={[
            { id: 'general', label: 'Général' }, { id: 'compte', label: 'Mon compte' },
            { id: 'users', label: 'Utilisateurs', count: DGd.UTILISATEURS.length }, { id: 'journal', label: "Journal d'activité" },
          ]} />
        </div>

        {tab === 'general' ? (
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Préférences générales</div>
            <Row label="Notifications par courriel" hint="Recevoir un courriel pour les alertes urgentes (livraison, retard de paiement).">
              <Toggle checked={t1} onChange={setT1} />
            </Row>
            <Row label="Recalcul automatique de la cédule" hint="Décaler les étapes suivantes en cascade quand une date change.">
              <Toggle checked={t2} onChange={setT2} />
            </Row>
            <Row label="Afficher les montants en vue compacte" hint="Ex. « 2,1 M$ » plutôt que « 2 100 000,00 $ » sur le dashboard.">
              <Toggle checked={t3} onChange={setT3} />
            </Row>
            <Row label="Jours ouvrables" hint="Base de calcul des durées d'étapes.">
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Lundi → Vendredi</span>
            </Row>
            <div style={{ paddingTop: 14 }}><Button variant="primary" icon={<i className="ti ti-device-floppy" />}>Enregistrer</Button></div>
          </Card>
        ) : null}

        {tab === 'compte' ? (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <Avatar name="Nicolas Savard" size="lg" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Nicolas Savard</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Directeur des opérations</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Nom complet" defaultValue="Nicolas Savard" />
              <Input label="Courriel" defaultValue="nicolas.savard@habitationsdg.com" />
              <Input label="Téléphone" defaultValue="418 555-0117" />
              <Input label="Rôle" defaultValue="Directeur des opérations" disabled />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 18, marginTop: 4, borderTop: '1px solid var(--divider)' }}>
              <Button variant="primary" icon={<i className="ti ti-device-floppy" />}>Enregistrer</Button>
              <Button variant="ghost" icon={<i className="ti ti-key" />}>Changer le mot de passe</Button>
            </div>
          </Card>
        ) : null}

        {tab === 'users' ? (
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-users" />} title="Utilisateurs" action={<Button size="sm" variant="outline" icon={<i className="ti ti-plus" />}>Inviter</Button>} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead><tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {[['Utilisateur', 'left'], ['Rôle', 'left'], ['Courriel', 'left'], ['Statut', 'left'], ['', 'right']].map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr></thead>
              <tbody>
                {DGd.UTILISATEURS.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i === DGd.UTILISATEURS.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                    <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={u.nom} size="sm" /><span style={{ fontWeight: 600 }}>{u.nom}</span></span></td>
                    <td style={{ padding: '10px 14px' }}><Badge tone={DGd.ROLE_TINT[u.role]}>{u.roleLabel}</Badge></td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{u.courriel}</td>
                    <td style={{ padding: '10px 14px' }}>{u.actif ? <Badge tone="success" dot>Actif</Badge> : <Badge tone="neutral">Inactif</Badge>}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}><button style={{ width: 26, height: 26, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 16 }}><i className="ti ti-dots" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}

        {tab === 'journal' ? (
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-history" />} title="Journal d'activité" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>tous les utilisateurs</span>} />
            <div style={{ padding: '4px 0' }}>
              {DGd.JOURNAL.map((j, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, padding: '11px 14px', borderBottom: i === DGd.JOURNAL.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                  <Avatar name={j.qui} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45 }}><b style={{ fontWeight: 600 }}>{j.qui}</b> <span style={{ color: 'var(--text-secondary)' }}>{j.action}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}><i className="ti ti-map-pin" style={{ fontSize: 12, verticalAlign: '-1px' }} /> {j.cible} · {j.quand}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    );
  }

  window.Parametres = Parametres;
})();
