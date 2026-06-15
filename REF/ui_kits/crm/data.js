/* ==========================================================================
   Habitations DG — UI kit shared data + logic (window.DG)
   Mirrors the production codebase: Québec money/date formatting, working-day
   date cascade, and auto task-status computation. Seed data from prisma/seed.ts
   + the 43-step TEMPLATE_JUMELE.
   ========================================================================== */
(function () {
  // "Today" for the kit — matches the project's current date so the Gantt's
  // completed / in-progress / upcoming split reads naturally.
  const TODAY = new Date(2026, 5, 12); // 12 juin 2026
  TODAY.setHours(0, 0, 0, 0);

  /* --- Québec formatting -------------------------------------------------- */
  const moisLong = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const moisShort = ['janv.','févr.','mars','avr.','mai','juin','juill.','août','sept.','oct.','nov.','déc.'];
  const joursLong = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

  function formatMontant(n, dec = 2) {
    return new Intl.NumberFormat('fr-CA', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n) + ' $';
  }
  function formatMontantCourt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + ' M$';
    if (n >= 1000) return Math.round(n / 1000) + ' k$';
    return formatMontant(n, 0);
  }
  function dateLong(d) { return `${d.getDate()} ${moisLong[d.getMonth()]} ${d.getFullYear()}`; }
  function dateCourt(d) { return `${d.getDate()} ${moisShort[d.getMonth()]}`; }
  function jourLong(d) { const s = `${joursLong[d.getDay()]} ${d.getDate()} ${moisLong[d.getMonth()]} ${d.getFullYear()}`; return s.charAt(0).toUpperCase() + s.slice(1); }

  /* --- Working-day date math (from cedula-utils.ts) ----------------------- */
  function addJoursOuvrables(date, n) {
    let d = new Date(date), count = 0;
    while (count < n) { d = new Date(d.getTime() + 86400000); const w = d.getDay(); if (w !== 0 && w !== 6) count++; }
    return d;
  }
  function subJoursOuvrables(date, n) {
    let d = new Date(date), count = 0;
    while (count < n) { d = new Date(d.getTime() - 86400000); const w = d.getDay(); if (w !== 0 && w !== 6) count++; }
    return d;
  }
  function joursOuvrableEntre(debut, fin) {
    let count = 0, cur = new Date(debut); cur.setHours(0,0,0,0);
    const f = new Date(fin); f.setHours(0,0,0,0);
    while (cur <= f) { const w = cur.getDay(); if (w !== 0 && w !== 6) count++; cur.setDate(cur.getDate()+1); }
    return count;
  }

  /* --- Auto task status by date (from task-status.ts / gantt-component) ---- */
  function tacheStatut(dateDebut, dateFin) {
    const debut = new Date(dateDebut); debut.setHours(0,0,0,0);
    const fin = new Date(dateFin); fin.setHours(0,0,0,0);
    const demain = new Date(TODAY); demain.setDate(TODAY.getDate() + 1);
    if (fin < TODAY) return 'termine';
    if (debut <= TODAY && fin >= TODAY) return 'encours';
    if (debut.getTime() === demain.getTime()) return 'demain';
    return 'avenir';
  }

  /* --- Phase config (from DashboardClient.tsx) ---------------------------- */
  const PHASES = {
    SIGNE:       { label: 'Signé',       bar: '#378ADD', tint: '#E6F1FB', ink: '#185FA5' },
    PREPARATION: { label: 'Préparation', bar: '#7F77DD', tint: '#EEEDFE', ink: '#3C3489' },
    CHANTIER:    { label: 'Chantier',    bar: '#EF9F27', tint: '#FAEEDA', ink: '#854F0B' },
    LIVRAISON:   { label: 'Livraison',   bar: '#639922', tint: '#EAF3DE', ink: '#3B6D11' },
    TERMINE:     { label: 'Terminé',     bar: '#B4B2A9', tint: '#F1EFE8', ink: '#5F5E5A' },
  };
  function phase(p) { return PHASES[p] || PHASES.SIGNE; }

  /* --- The canonical 43-step jumelé schedule (TEMPLATE_JUMELE) ------------ */
  const TEMPLATE = [
    ['Excavation',3,'Interne'],['Fondations',5,'Interne'],['Charpente',10,'Interne'],['Mur extérieur',5,'Interne'],
    ['Plombier fond de cave',2,'Plomberie Côté'],['Couler plancher intérieur',1,'Interne'],['Intérieur division',3,'Interne'],
    ['Installation foyer',2,'Interne'],['Intérieur division (2)',1,'Interne'],['Mesure armoire',1,'Cuisines Beauce'],
    ['Air climatisé',1,'Ventil. Express'],['Électricien + TV & Tél',2,'Élec. Vachon'],['Plombier',1,'Plomberie Côté'],
    ['Échangeur d\u2019air',1,'Ventil. Express'],['Isolation entretoit',1,'Interne'],['Mesure finition',1,'Interne'],
    ['Final menuiserie',2,'Interne'],['Entrée gypse',1,'Gypse Beauce'],['Pose gypse',3,'Gypse Beauce'],
    ['Tireur de joints',5,'Gypse Beauce'],['Entrée finition',1,'Interne'],['Pose finition',3,'Interne'],
    ['Peinture',3,'Peinture Martin'],['Livraison céramique',1,'Céramique Plus'],['Pose céramique',2,'Céramique Plus'],
    ['Coulis',1,'Céramique Plus'],['Livraison armoire',1,'Cuisines Beauce'],['Pose armoire',1,'Cuisines Beauce'],
    ['Dosseret',1,'Cuisines Beauce'],['Livraison fixture',1,'Interne'],['Finition électrique + TV & Tél',1,'Élec. Vachon'],
    ['Finition plomberie',1,'Plomberie Côté'],['Finition échangeur d\u2019air',1,'Ventil. Express'],['Air climatisé final',1,'Ventil. Express'],
    ['Installation porte de douche',1,'Interne'],['Pose escalier ou rampe',1,'Interne'],['Pose plancher',2,'Interne'],
    ['Petite finition',1,'Interne'],['Peinture finale',2,'Peinture Martin'],['Pose miroir + tablettes',1,'Interne'],
    ['Service +',1,'Interne'],['Pose tapis',1,'Interne'],['Ménage',1,'Interne'],
  ];

  // Visible-client default: first 8 are internal/structural -> false
  const INTERNE_COUNT = 8;

  /* Build a dated schedule anchored to a delivery date (livraison - 5 ouvr.) */
  function buildSchedule(dateLivraison) {
    const etapes = TEMPLATE.map((t, i) => ({
      ordre: i + 1, nom: t[0], jours: t[1], assigneA: t[2],
      buffer: 0, visibleClient: i >= INTERNE_COUNT,
      dateDebut: null, dateFin: null,
    }));
    let cursor = subJoursOuvrables(dateLivraison, 5);
    for (let i = etapes.length - 1; i >= 0; i--) {
      const e = etapes[i];
      e.dateFin = new Date(cursor);
      e.dateDebut = e.jours <= 1 ? new Date(cursor) : subJoursOuvrables(cursor, e.jours - 1);
      cursor = subJoursOuvrables(e.dateDebut, 1);
    }
    etapes.forEach(e => { e.statut = tacheStatut(e.dateDebut, e.dateFin); });
    return etapes;
  }

  /* --- Projects (from seed.ts) ------------------------------------------- */
  const projets = [
    { id:'p1', slug:'michel-rodrigue', client:'Michel Rodrigue', adresse:'18 Rue des Érables', ville:'Saint-Henri',
      type:'JUMELE', contrat:'PRELIMINAIRE', montant:487500, phase:'LIVRAISON', avancement:88,
      dateContrat:new Date(2025,8,15), dateLivraison:new Date(2026,5,20) },
    { id:'p2', slug:'isabelle-cloutier', client:'Isabelle Cloutier', adresse:'7 Chemin des Pins', ville:'Saint-Lazare-de-Bellechasse',
      type:'MAISON', contrat:'ENTREPRISE', montant:612000, phase:'CHANTIER', avancement:60,
      dateContrat:new Date(2025,10,3), dateLivraison:new Date(2026,7,14) },
    { id:'p3', slug:'steve-beaulieu', client:'Steve Beaulieu', adresse:'144 Route du Lac', ville:'Saint-Damien-de-Buckland',
      type:'JUMELE', contrat:'ENTREPRISE', montant:398000, phase:'CHANTIER', avancement:25,
      dateContrat:new Date(2026,0,20), dateLivraison:new Date(2026,9,3) },
    { id:'p4', slug:'nathalie-grondin', client:'Nathalie Grondin', adresse:'33 Rue Principale', ville:'Saint-Gervais',
      type:'MAISON', contrat:'PRELIMINAIRE', montant:541000, phase:'PREPARATION', avancement:5,
      dateContrat:new Date(2026,3,8), dateLivraison:new Date(2026,11,18) },
    { id:'p5', slug:'marc-page', client:'Marc Pagé', adresse:'52 Rue des Bouleaux', ville:'Honfleur',
      type:'JUMELE', contrat:'ENTREPRISE', montant:421000, phase:'CHANTIER', avancement:42,
      dateContrat:new Date(2025,11,2), dateLivraison:new Date(2026,8,11) },
    { id:'p6', slug:'julie-fortin', client:'Julie Fortin', adresse:'9 Place du Verger', ville:'Sainte-Claire',
      type:'MAISON', contrat:'PRELIMINAIRE', montant:573000, phase:'SIGNE', avancement:0,
      dateContrat:new Date(2026,4,28), dateLivraison:new Date(2027,1,5) },
    { id:'p7', slug:'eric-lemieux', client:'Éric Lemieux', adresse:'210 Rang Saint-Charles', ville:'Saint-Anselme',
      type:'JUMELE', contrat:'ENTREPRISE', montant:389000, phase:'CHANTIER', avancement:71,
      dateContrat:new Date(2025,9,18), dateLivraison:new Date(2026,6,9) },
  ];

  // Derive avancement from the dated schedule so the % matches the Gantt exactly.
  projets.forEach(p => {
    if (p.phase === 'SIGNE') { p.avancement = 0; return; }
    const s = buildSchedule(p.dateLivraison);
    p.avancement = Math.round(s.filter(e => e.statut === 'termine').length / s.length * 100);
  });
  // Showcase project for the Cédule screen — richest status spread.
  const SHOWCASE = 'p7';

  function joursRestants(d) { return Math.round((d - TODAY) / 86400000); }
  function prochaineEtape(p) {
    const sched = buildSchedule(p.dateLivraison);
    return sched.find(e => e.statut === 'encours') || sched.find(e => e.statut === 'demain') || sched.find(e => e.statut === 'avenir') || sched[sched.length-1];
  }

  /* --- Dashboard derived data -------------------------------------------- */
  const alertes = [
    { type:'urgent', titre:'Livraison imminente', sous:'18 Rue des Érables · Michel Rodrigue', badge:'8 j', projet:'p1' },
    { type:'warn', titre:'Extra non signé · 890 $', sous:'144 Route du Lac · Steve Beaulieu', badge:'À confirmer', projet:'p3' },
    { type:'warn', titre:'Paiement en retard · 187 500 $', sous:'7 Chemin des Pins · Isabelle Cloutier', badge:'Tranche 2', projet:'p2' },
  ];

  // Week agenda — steps grouped by weekday (lun→ven), drawn from live schedules
  function semaineAgenda() {
    const lundi = new Date(TODAY); const dow = lundi.getDay();
    lundi.setDate(lundi.getDate() - (dow === 0 ? 6 : dow - 1));
    const jours = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(lundi); d.setDate(lundi.getDate() + i); d.setHours(0,0,0,0);
      jours.push({ date:d, label: jourLong(d).replace(/ \d{4}$/, ''), etapes: [] });
    }
    projets.forEach(p => {
      const sched = buildSchedule(p.dateLivraison);
      sched.forEach(e => {
        const ds = new Date(e.dateDebut); ds.setHours(0,0,0,0);
        jours.forEach(j => { if (ds.getTime() === j.date.getTime()) j.etapes.push({ nom:e.nom, projet:p.adresse, client:p.client, assigneA:e.assigneA, phase:p.phase }); });
      });
    });
    return jours.filter(j => j.etapes.length);
  }

  window.DG = {
    TODAY, moisLong, moisShort, joursLong,
    formatMontant, formatMontantCourt, dateLong, dateCourt, jourLong,
    addJoursOuvrables, subJoursOuvrables, joursOuvrableEntre, tacheStatut,
    PHASES, phase, TEMPLATE, buildSchedule, projets, alertes, semaineAgenda, SHOWCASE,
    joursRestants, prochaineEtape,
    montantTotalChantier: projets.filter(p=>['CHANTIER','LIVRAISON'].includes(p.phase)).reduce((s,p)=>s+p.montant,0),
  };
})();
