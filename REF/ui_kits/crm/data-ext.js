/* ==========================================================================
   Habitations DG — UI kit EXTENDED data (window.DG additions)
   Runs after data.js. Adds: clients, fournisseurs, employés, costing,
   feuilles de temps, GCR, géo-coordonnées, utilisateurs, journal d'activité.
   Derived from the same seed/schema understanding as data.js.
   ========================================================================== */
(function () {
  const DG = window.DG;
  if (!DG) { console.error('data-ext.js: window.DG manquant'); return; }
  const d = (y, m, day) => new Date(y, m, day);

  /* --- Vendeurs / chargés (sur les projets) ------------------------------ */
  const VENDEURS = { p1:'Carl Boucher', p2:'Carl Boucher', p3:'Mélanie Roy', p4:'Carl Boucher', p5:'Mélanie Roy', p6:'Carl Boucher', p7:'Mélanie Roy' };
  const CHARGES = { p1:'Mélanie Vachon', p2:'Mélanie Vachon', p3:'Jonathan Bélanger', p4:'Mélanie Vachon', p5:'Jonathan Bélanger', p6:'Mélanie Vachon', p7:'Jonathan Bélanger' };
  DG.projets.forEach(p => { p.vendeur = VENDEURS[p.id]; p.charge = CHARGES[p.id]; p.tel = '418 555-' + (1000 + parseInt(p.id.slice(1)) * 137 % 8999).toString().slice(0,4); });

  /* --- Géo-coordonnées (Beauce / Chaudière-Appalaches) ------------------- */
  const GEO = {
    p1:[46.690,-71.070], p2:[46.553,-70.502], p3:[46.621,-70.651], p4:[46.713,-70.892],
    p5:[46.648,-70.879], p6:[46.601,-70.864], p7:[46.624,-70.981],
  };
  DG.projets.forEach(p => { p.lat = GEO[p.id][0]; p.lng = GEO[p.id][1]; });

  /* --- Extras par projet -------------------------------------------------- */
  const EXTRAS = {
    p1:[['Céramique format 24x24',1200,'SIGNE'],['Escalier bois franc',2400,'SIGNE'],['Luminaires DEL — cuisine',680,'EN_ATTENTE']],
    p2:[['Plancher chauffant salle de bain',3200,'SIGNE'],['Comptoir quartz',4100,'EN_ATTENTE']],
    p3:[['Foyer au gaz',3600,'SIGNE'],['Agrandissement terrasse',890,'EN_ATTENTE']],
    p5:[['Garage isolé',12500,'SIGNE'],['Stores motorisés',2100,'EN_ATTENTE']],
    p7:[['Douche en céramique',2800,'SIGNE'],['Îlot de cuisine sur mesure',3900,'SIGNE'],['Borne recharge VÉ',1450,'EN_ATTENTE']],
  };
  function extras(pid) { return (EXTRAS[pid] || []).map(e => ({ nom:e[0], montant:e[1], statut:e[2] })); }
  function extrasTotal(pid, signedOnly) { return extras(pid).filter(e => !signedOnly || e.statut === 'SIGNE').reduce((s,e)=>s+e.montant,0); }

  /* --- Paiements par projet (tranches) ----------------------------------- */
  function paiements(pid) {
    const p = DG.projets.find(x => x.id === pid); if (!p) return [];
    const t1 = Math.round(p.montant * 0.15), t3 = Math.round(p.montant * 0.15), t2 = p.montant - t1 - t3;
    const recu = p.avancement;
    return [
      { nom:'Acompte (15%)', montant:t1, statut: recu >= 5 ? 'RECU' : 'ATTENDU', date: p.dateContrat },
      { nom:'Tranche chantier (70%)', montant:t2, statut: recu >= 60 ? 'RECU' : (recu >= 25 ? 'PARTIEL' : 'ATTENDU'), date: DG.addJoursOuvrables(p.dateContrat, 40) },
      { nom:'Solde à la livraison (15%)', montant:t3, statut: recu >= 99 ? 'RECU' : 'ATTENDU', date: p.dateLivraison },
    ];
  }

  /* --- COSTING ----------------------------------------------------------- */
  const CATEGORIES = [
    ['Excavation & terrassement', 0.055, 'backhoe'],
    ['Fondation & béton',         0.095, 'wall'],
    ['Structure & charpente',     0.165, 'home-2'],
    ['Toiture & revêtement ext.', 0.105, 'roof'],
    ['Plomberie',                 0.060, 'pipe'],
    ['Électricité',               0.055, 'bolt'],
    ['Ventilation & CVC',         0.040, 'air-conditioning'],
    ['Isolation & gypse',         0.080, 'layout-board'],
    ['Cuisine & armoires',        0.075, 'tools-kitchen-2'],
    ['Revêtements & céramique',   0.060, 'grid-dots'],
    ['Peinture & finition',       0.050, 'brush'],
    ['Main-d\u2019œuvre interne', 0.095, 'users'],
    ['Divers & imprévus',         0.020, 'dots'],
  ];
  const MARGE = { p1:0.205, p2:0.158, p3:0.088, p4:0.192, p5:0.142, p6:0.225, p7:0.176 };

  function santeMarge(m) {
    if (m >= 0.18) return 'success';
    if (m >= 0.12) return 'warning';
    return 'danger';
  }
  function costing(pid) {
    const p = DG.projets.find(x => x.id === pid); if (!p) return null;
    const revenusContrat = p.montant;
    const revenusExtras = extrasTotal(pid, true);
    const revenus = revenusContrat + revenusExtras;
    const marge = MARGE[pid] != null ? MARGE[pid] : 0.16;
    const depensesTotal = Math.round(revenus * (1 - marge));
    const av = Math.max(0.02, p.avancement / 100);
    // jitter helper (deterministic by index)
    const cats = CATEGORIES.map((c, i) => {
      const budget = Math.round(depensesTotal * c[1] / 0.955);
      const f = Math.min(1, av + ((i * 37) % 23 - 11) / 100 * (av < 0.95 ? 1 : 0));
      const reel = Math.round(budget * Math.max(0, Math.min(1, f)));
      return { nom:c[0], icon:c[2], budget, reel, ecart: reel - budget };
    });
    const budgetTotal = cats.reduce((s,c)=>s+c.budget,0);
    const reelTotal = cats.reduce((s,c)=>s+c.reel,0);
    const profit = revenus - budgetTotal;
    const mo = cats.find(c => /Main/.test(c.nom));
    return { revenus, revenusContrat, revenusExtras, depensesTotal: budgetTotal, depensesReel: reelTotal,
      profit, marge: profit / revenus, sante: santeMarge(profit / revenus), cats, mainOeuvre: mo };
  }
  function costingGlobal() {
    const rows = DG.projets.filter(p => p.phase !== 'SIGNE').map(p => {
      const c = costing(p.id);
      return { id:p.id, projet:p.adresse, client:p.client, phase:p.phase,
        revenus:c.revenus, depenses:c.depensesTotal, profit:c.profit, marge:c.marge, sante:c.sante, avancement:p.avancement };
    });
    const revenus = rows.reduce((s,r)=>s+r.revenus,0);
    const depenses = rows.reduce((s,r)=>s+r.depenses,0);
    const profit = revenus - depenses;
    return { rows, revenus, depenses, profit, marge: profit / revenus, sante: santeMarge(profit / revenus) };
  }

  /* --- EMPLOYÉS / FEUILLES DE TEMPS -------------------------------------- */
  const EMPLOYES = [
    { id:'e1', nom:'Jonathan Bélanger', role:'Chargé de projet', taux:38.50, max:36.5, actif:true },
    { id:'e2', nom:'Kevin Roy',          role:'Charpentier-menuisier', taux:32.00, max:36.5, actif:true },
    { id:'e3', nom:'Patrick Gagné',      role:'Charpentier-menuisier', taux:33.50, max:36.5, actif:true },
    { id:'e4', nom:'Marc-André Thibault', role:'Manœuvre', taux:26.00, max:36.5, actif:true },
    { id:'e5', nom:'Steve Pelletier',    role:'Charpentier-menuisier', taux:31.00, max:36.5, actif:true },
    { id:'e6', nom:'Mélanie Vachon',     role:'Chargée de projet', taux:39.00, max:36.5, actif:true },
    { id:'e7', nom:'Dany Lessard',       role:'Manœuvre', taux:25.50, max:36.5, actif:false },
  ];
  // Weekly hours grid: emp -> [lun,mar,mer,jeu,ven], + project assignment per emp
  const SEMAINE_HEURES = {
    e1:[7.5,7.5,7.5,7,7.5], e2:[8,8,8,7.5,8], e3:[7.5,8,8,8,4], e4:[7,7.5,7.5,7.5,7.5],
    e5:[8,8,4,0,0], e6:[7.5,7.5,7.5,7.5,6], e7:[0,0,0,0,0],
  };
  const SEMAINE_PROJET = { e1:'p7', e2:'p2', e3:'p2', e4:'p5', e5:'p3', e6:'p7', e7:'—' };
  function semaineCourante() {
    const lundi = new Date(DG.TODAY); const dow = lundi.getDay();
    lundi.setDate(lundi.getDate() - (dow === 0 ? 6 : dow - 1)); lundi.setHours(0,0,0,0);
    const jours = []; for (let i=0;i<5;i++){ const x=new Date(lundi); x.setDate(lundi.getDate()+i); jours.push(x); }
    return jours;
  }
  function feuillesSemaine() {
    return EMPLOYES.filter(e=>e.actif).map(e => {
      const h = SEMAINE_HEURES[e.id] || [0,0,0,0,0];
      const total = h.reduce((s,x)=>s+x,0);
      return { ...e, heures:h, total, projet: SEMAINE_PROJET[e.id],
        depasse: total > e.max, sousMax: total < e.max - 2 };
    });
  }

  /* --- GCR (Garantie de construction résidentielle) ---------------------- */
  function gcr(pid) {
    const p = DG.projets.find(x => x.id === pid); if (!p) return null;
    const av = p.avancement;
    const checklist = [
      ['Plan de garantie GCR enregistré', true],
      ['Contrat d\u2019entreprise signé', true],
      ['Acompte protégé (dépôt en fidéicommis)', true],
      ['Certificat de localisation reçu', av >= 30],
      ['Formulaire de pré-réception préparé', av >= 80],
      ['Liste de déficiences remise au client', av >= 90],
      ['Réception du bâtiment signée', av >= 99],
    ];
    const inspections = [
      { nom:'Inspection pré-livraison', date: DG.subJoursOuvrables(p.dateLivraison, 8), statut: av >= 85 ? 'PLANIFIE' : 'A_VENIR', insp:'Mélanie Vachon' },
      { nom:'Réception du bâtiment', date: p.dateLivraison, statut: av >= 99 ? 'PLANIFIE' : 'A_VENIR', insp:'Nicolas Savard' },
      { nom:'Visite de garantie — 1 an', date: new Date(p.dateLivraison.getFullYear()+1, p.dateLivraison.getMonth(), p.dateLivraison.getDate()), statut:'A_VENIR', insp:'—' },
    ];
    const done = checklist.filter(c=>c[1]).length;
    return { checklist: checklist.map(c=>({label:c[0], fait:c[1]})), done, total: checklist.length, inspections };
  }

  /* --- UTILISATEURS ------------------------------------------------------ */
  const UTILISATEURS = [
    { id:'u1', nom:'Nicolas Savard', courriel:'nicolas.savard@habitationsdg.com', role:'ADMIN', roleLabel:'Directeur des opérations', actif:true },
    { id:'u2', nom:'Sophie-Rose Dion', courriel:'sophie-rose.dion@habitationsdg.com', role:'COMPTA', roleLabel:'Comptabilité', actif:true },
    { id:'u3', nom:'Carl Boucher', courriel:'carl.boucher@habitationsdg.com', role:'VENDEUR', roleLabel:'Vendeur', actif:true },
    { id:'u4', nom:'Mélanie Roy', courriel:'melanie.roy@habitationsdg.com', role:'VENDEUR', roleLabel:'Vendeuse', actif:true },
    { id:'u5', nom:'Mélanie Vachon', courriel:'melanie.vachon@habitationsdg.com', role:'CHARGE_PROJET', roleLabel:'Chargée de projet', actif:true },
    { id:'u6', nom:'Jonathan Bélanger', courriel:'jonathan.belanger@habitationsdg.com', role:'CHARGE_PROJET', roleLabel:'Chargé de projet', actif:true },
  ];
  const ROLE_TINT = { ADMIN:'danger', COMPTA:'info', VENDEUR:'success', CHARGE_PROJET:'warning' };

  /* --- CLIENTS / FOURNISSEURS -------------------------------------------- */
  const CLIENTS = DG.projets.map(p => ({
    id:'c'+p.id.slice(1), nom:p.client, projet:p.id, adresse:p.adresse, ville:p.ville,
    courriel: p.client.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'.').replace(/\.+/g,'.') + '@courriel.com',
    tel:p.tel, phase:p.phase,
  }));
  const FOURNISSEURS = [
    { id:'f1', nom:'Plomberie Côté', metier:'Plomberie', contact:'Réjean Côté', tel:'418 555-2210', actifs:3 },
    { id:'f2', nom:'Gypse Beauce', metier:'Gypse & joints', contact:'Luc Vachon', tel:'418 555-7782', actifs:4 },
    { id:'f3', nom:'Élec. Vachon', metier:'Électricité', contact:'Martin Vachon', tel:'418 555-3391', actifs:5 },
    { id:'f4', nom:'Peinture Martin', metier:'Peinture', contact:'Martin Boutin', tel:'418 555-8847', actifs:2 },
    { id:'f5', nom:'Céramique Plus', metier:'Céramique & revêtement', contact:'Sylvie Roy', tel:'418 555-6620', actifs:3 },
    { id:'f6', nom:'Cuisines Beauce', metier:'Armoires & comptoirs', contact:'André Poulin', tel:'418 555-1145', actifs:4 },
    { id:'f7', nom:'Ventil. Express', metier:'Ventilation / CVC', contact:'Éric Lessard', tel:'418 555-9903', actifs:5 },
    { id:'f8', nom:'Bomat', metier:'Matériaux de construction', contact:'Comptoir pro', tel:'418 555-4400', actifs:7 },
    { id:'f9', nom:'Canac', metier:'Quincaillerie', contact:'Comptoir contracteur', tel:'418 555-2002', actifs:7 },
    { id:'f10', nom:'Rona', metier:'Quincaillerie', contact:'Comptoir pro', tel:'418 555-5567', actifs:6 },
  ];

  /* --- JOURNAL D'ACTIVITÉ ------------------------------------------------ */
  const JOURNAL = [
    { qui:'Nicolas Savard', action:'a décalé l\u2019étape « Pose gypse » de +2 jours', cible:'210 Rang Saint-Charles', quand:'il y a 12 min', icon:'calendar-event' },
    { qui:'Sophie-Rose Dion', action:'a marqué la tranche chantier comme reçue (272 300 $)', cible:'7 Chemin des Pins', quand:'il y a 1 h', icon:'cash' },
    { qui:'Carl Boucher', action:'a signé un extra « Îlot de cuisine sur mesure » (3 900 $)', cible:'210 Rang Saint-Charles', quand:'il y a 3 h', icon:'receipt' },
    { qui:'Mélanie Vachon', action:'a envoyé la cédule au client', cible:'18 Rue des Érables', quand:'hier, 16 h 42', icon:'send' },
    { qui:'Nicolas Savard', action:'a complété l\u2019étape « Tireur de joints »', cible:'52 Rue des Bouleaux', quand:'hier, 11 h 03', icon:'circle-check' },
    { qui:'Sophie-Rose Dion', action:'a ajouté une dépense « Bomat — 4 280 $ »', cible:'144 Route du Lac', quand:'lun. 9 juin', icon:'plus' },
    { qui:'Carl Boucher', action:'a créé le projet', cible:'9 Place du Verger', quand:'jeu. 28 mai', icon:'building-plus' },
  ];

  Object.assign(DG, {
    extras, extrasTotal, paiements, CATEGORIES, costing, costingGlobal, santeMarge,
    EMPLOYES, feuillesSemaine, semaineCourante,
    gcr, UTILISATEURS, ROLE_TINT, CLIENTS, FOURNISSEURS, JOURNAL,
  });
})();
