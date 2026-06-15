/* Écran — États & patterns : empty states, skeletons, toasts, dialogs, alerte cascade. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { Card, CardHeader, Button, EmptyState, Skeleton, SkeletonRow, Toast, ToastStack, Dialog, Badge } = NS;

  function Section({ title, hint, children }) {
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
          {hint ? <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{hint}</div> : null}
        </div>
        {children}
      </div>
    );
  }

  function States() {
    const [toasts, setToasts] = React.useState([]);
    const [confirm, setConfirm] = React.useState(false);
    const [cascade, setCascade] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    function push(t) {
      const id = Date.now() + Math.random();
      setToasts(ts => [...ts, { ...t, id }]);
      setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 4200);
    }

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 1080 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>États & patterns</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Empty states, chargement, notifications, confirmations et l'alerte de décalage de cédule.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {/* Empty states */}
          <Section title="Empty states" hint="Aucun projet · aucune cédule · aucune dépense">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <Card padding={false}><EmptyState compact icon="building-community" title="Aucun projet actif" message="Crée ton premier projet pour générer une cédule." action={<Button size="sm" icon={<i className="ti ti-plus" />}>Nouveau projet</Button>} /></Card>
              <Card padding={false}><EmptyState compact icon="calendar-off" title="Aucune cédule" message="La cédule a été passée. Génère-la quand le projet est planifié." action={<Button size="sm" variant="outline" icon={<i className="ti ti-wand" />}>Générer</Button>} /></Card>
              <Card padding={false}><EmptyState compact icon="receipt-off" title="Aucune dépense" message="Ajoute une facture fournisseur pour suivre le costing." action={<Button size="sm" variant="outline" icon={<i className="ti ti-plus" />}>Ajouter</Button>} /></Card>
            </div>
          </Section>

          {/* Loading */}
          <Section title="États de chargement (skeletons)" hint="Pendant le chargement d'une liste ou d'une cédule">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Card padding={false} style={{ flex: 1, minWidth: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <Skeleton width={120} height={13} />
                  <Button size="sm" variant="ghost" onClick={() => setLoading(l => !l)}>{loading ? 'Afficher chargé' : 'Rejouer'}</Button>
                </div>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={[32, '52%', 70, 50]} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--divider)' }} />)
                  : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i === 3 ? 'none' : '1px solid var(--divider)', fontSize: 12.5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--task-termine)' }} /><span style={{ flex: 1, fontWeight: 500 }}>Étape complétée</span><Badge tone="success" dot>Terminé</Badge>
                    </div>
                  ))}
              </Card>
            </div>
          </Section>

          {/* Toasts */}
          <Section title="Toasts / notifications" hint="Confirmations passagères en bas à droite">
            <Card><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="success" icon={<i className="ti ti-send" />} onClick={() => push({ tone: 'success', title: 'Cédule envoyée', message: 'Le client a reçu l\u2019échéancier par courriel.' })}>Succès</Button>
              <Button variant="outline" icon={<i className="ti ti-cash" />} onClick={() => push({ tone: 'info', title: 'Paiement enregistré', message: 'Tranche chantier · 272 300 $.' })}>Info</Button>
              <Button variant="outline" icon={<i className="ti ti-alert-triangle" />} onClick={() => push({ tone: 'warning', title: 'Étape sous le maximum', message: 'Kevin Roy : 31,5 h cette semaine.' })}>Avertissement</Button>
              <Button variant="outline" icon={<i className="ti ti-alert-circle" />} onClick={() => push({ tone: 'danger', title: 'Conflit de cédule', message: '« Pose gypse » chevauche l\u2019étape précédente.' })}>Erreur</Button>
            </div></Card>
          </Section>

          {/* Dialogs */}
          <Section title="Dialogs de confirmation" hint="Suppression destructive · recalcul en cascade">
            <Card><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="danger" icon={<i className="ti ti-trash" />} onClick={() => setConfirm(true)}>Supprimer un projet…</Button>
              <Button variant="outline" icon={<i className="ti ti-calendar-event" />} onClick={() => setCascade(true)}>Décaler une étape…</Button>
            </div></Card>
          </Section>
        </div>

        {/* Toast stack */}
        <ToastStack>
          {toasts.map(t => <Toast key={t.id} tone={t.tone} title={t.title} message={t.message} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />)}
        </ToastStack>

        {/* Confirm delete */}
        <Dialog open={confirm} onClose={() => setConfirm(false)} tone="danger" icon="trash" title="Supprimer ce projet ?"
          footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Annuler</Button><Button variant="danger" onClick={() => { setConfirm(false); push({ tone: 'danger', title: 'Projet supprimé', message: '18 Rue des Érables a été retiré.' }); }}>Supprimer définitivement</Button></>}>
          Cette action est irréversible. La cédule, les extras et les paiements liés à <b>18 Rue des Érables</b> seront retirés.
        </Dialog>

        {/* Cascade shift */}
        <Dialog open={cascade} onClose={() => setCascade(false)} tone="warning" icon="calendar-event" title="Recalculer la cédule en cascade ?"
          footer={<><Button variant="ghost" onClick={() => setCascade(false)}>Décaler cette étape seulement</Button><Button variant="primary" onClick={() => { setCascade(false); push({ tone: 'warning', title: 'Cédule recalculée', message: '11 étapes décalées de +2 jours.', }); }}>Recalculer en cascade</Button></>}>
          L'étape <b>« Pose gypse »</b> est décalée de <b>+2 jours ouvrables</b>. 11 étapes suivantes peuvent être repoussées d'autant pour préserver les durées et les buffers. La date de livraison passerait au <b>22 juin 2026</b>.
        </Dialog>
      </div>
    );
  }

  window.States = States;
})();
