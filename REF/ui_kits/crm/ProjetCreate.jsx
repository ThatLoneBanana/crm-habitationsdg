/* Écran — Création de projet : flux 4 étapes (Client → Projet → Cédule → Confirmation). */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { Stepper, Button, Input, Select, Card, Badge, Toggle, PhaseBadge } = NS;

  const STEPS = ['Client', 'Projet', 'Cédule', 'Confirmation'];

  function Field({ label, children }) {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        {children}
      </label>
    );
  }
  function TextField({ label, ...rest }) {
    return <Field label={label}><input {...rest} style={{ height: 32, padding: '0 10px', fontSize: 12.5, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-sans)', background: 'var(--surface)', width: '100%' }} /></Field>;
  }

  function ProjetCreate({ onCancel, onDone }) {
    const DGd = window.DG;
    const [step, setStep] = React.useState(0);
    const [skipCedule, setSkipCedule] = React.useState(false);
    const [type, setType] = React.useState('JUMELE');
    const [contrat, setContrat] = React.useState('ENTREPRISE');
    const livraison = new Date(2027, 1, 26);
    const sched = React.useMemo(() => DGd.buildSchedule(livraison), []);

    const next = () => setStep(s => Math.min(STEPS.length - 1, s + (s === 2 && skipCedule ? 1 : 1)));
    const back = () => setStep(s => Math.max(0, s - 1));

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 820, margin: '0 auto' }}>
        <button onClick={onCancel} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 12, padding: 0, marginBottom: 14 }}>
          <i className="ti ti-chevron-left" style={{ fontSize: 14 }} />Annuler la création
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20 }}>Nouveau projet</h1>

        <div style={{ marginBottom: 24 }}><Stepper current={step} steps={STEPS} /></div>

        <Card>
          {step === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Informations du client</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>À qui appartient ce projet de construction&nbsp;?</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <TextField label="Prénom" defaultValue="Geneviève" />
                <TextField label="Nom" defaultValue="Tremblay" />
                <TextField label="Courriel" defaultValue="genevieve.tremblay@courriel.com" />
                <TextField label="Téléphone" defaultValue="418 555-0142" />
                <TextField label="Adresse postale actuelle" defaultValue="44 Rue Notre-Dame" />
                <TextField label="Ville" defaultValue="Sainte-Marie" />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Détails du projet</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Adresse du chantier, type et contrat.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <TextField label="Adresse du chantier" defaultValue="12 Rue des Cèdres" />
                <TextField label="Ville" defaultValue="Scott" />
                <Field label="Type de projet">
                  <Select value={type} onChange={e => setType(e.target.value)} options={[{ value: 'MAISON', label: 'Maison' }, { value: 'JUMELE', label: 'Jumelé' }, { value: 'LOGEMENT', label: 'Logement' }]} />
                </Field>
                <Field label="Type de contrat">
                  <Select value={contrat} onChange={e => setContrat(e.target.value)} options={[{ value: 'PRELIMINAIRE', label: 'Préliminaire' }, { value: 'ENTREPRISE', label: 'Entreprise' }]} />
                </Field>
                <TextField label="Montant du contrat" defaultValue="456 000 $" />
                <TextField label="Date de livraison visée" defaultValue="26 février 2027" />
              </div>
              <div style={{ display: 'flex', gap: 10, padding: '11px 13px', background: 'var(--info-tint)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--info-text)' }}>
                <i className="ti ti-info-circle" style={{ fontSize: 16, flexShrink: 0 }} />
                Le projet démarre en phase <b style={{ margin: '0 3px' }}>Signé</b>. La phase avancera automatiquement selon l'avancement de la cédule.
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Cédule de construction</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Génère l'échéancier {type === 'JUMELE' ? 'jumelé' : 'standard'} de 43 étapes à partir de la date de livraison.</div>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <Toggle checked={skipCedule} onChange={setSkipCedule} />Passer la cédule
                </label>
              </div>

              {skipCedule ? (
                <div style={{ display: 'flex', gap: 10, padding: '14px', background: 'var(--surface-subtle)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <i className="ti ti-calendar-off" style={{ fontSize: 18, color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <div>La cédule sera <b>vide</b>. Tu pourras la générer ou la bâtir manuellement plus tard depuis l'onglet Cédule du projet. Utile pour un contrat préliminaire pas encore planifié.</div>
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 13px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)', fontSize: 11.5 }}>
                    <span style={{ fontWeight: 600 }}>Aperçu — {sched.length} étapes</span>
                    <span style={{ color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{DGd.dateCourt(sched[0].dateDebut)} → {DGd.dateCourt(livraison)} · {DGd.joursOuvrableEntre(sched[0].dateDebut, livraison)} j ouvr.</span>
                  </div>
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {sched.slice(0, 10).map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 13px', borderBottom: '1px solid var(--divider)', fontSize: 12 }}>
                        <span style={{ color: 'var(--text-tertiary)', width: 18, fontVariantNumeric: 'tabular-nums' }}>{e.ordre}</span>
                        <span style={{ flex: 1, fontWeight: 500 }}>{e.nom}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{e.jours}j · {DGd.dateCourt(e.dateDebut)}</span>
                      </div>
                    ))}
                    <div style={{ padding: '8px 13px', fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>… {sched.length - 10} étapes de plus</div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', textAlign: 'center', padding: '14px 0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--success-tint)', color: 'var(--success)' }}>
                <i className="ti ti-check" style={{ fontSize: 30 }} />
              </span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Prêt à créer le projet</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Vérifie le récapitulatif avant de confirmer.</div>
              </div>
              <div style={{ width: '100%', maxWidth: 460, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', textAlign: 'left' }}>
                {[['Client', 'Geneviève Tremblay'], ['Chantier', '12 Rue des Cèdres, Scott'], ['Type', type === 'JUMELE' ? 'Jumelé' : type === 'MAISON' ? 'Maison' : 'Logement'], ['Contrat', contrat === 'ENTREPRISE' ? 'Entreprise · 456 000 $' : 'Préliminaire · 456 000 $'], ['Livraison', '26 février 2027'], ['Cédule', skipCedule ? 'Passée (vide)' : `${sched.length} étapes générées`]].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i === 5 ? 'none' : '1px solid var(--divider)', fontSize: 12.5 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{r[0]}</span>
                    <span style={{ fontWeight: 600 }}>{r[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        {/* Footer nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          <Button variant="ghost" onClick={step === 0 ? onCancel : back}>{step === 0 ? 'Annuler' : '← Précédent'}</Button>
          {step < 3
            ? <Button variant="primary" onClick={next} iconTrailing={<i className="ti ti-arrow-right" />}>{step === 2 && skipCedule ? 'Passer et continuer' : 'Continuer'}</Button>
            : <Button variant="primary" icon={<i className="ti ti-check" />} onClick={onDone}>Créer le projet</Button>}
        </div>
      </div>
    );
  }

  window.ProjetCreate = ProjetCreate;
})();
