'use client';

import { useEffect, useState } from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { calculateTaskStatus } from '@/lib/task-status';

// Échéancier des travaux en TABLEAU (gabarit DG), LETTER portrait.
// Deux variantes via un seul moteur (avecFournisseur). Tout est date-based
// (calculateTaskStatus) ; aucune couleur basée sur l'enum statut manuel.
// Rendu en rangées flex à largeurs FIXES + bordures par cellule (le texte sur
// 2 lignes fait grandir toute la rangée, bordures alignées) — aucune position
// absolue, aucun pixelPerDay.

interface EcheancierTableauPDFProps {
  projet: any;
  parametres?: { rbq?: string; siteWeb?: string };
  avecFournisseur: boolean;
  logoBase64?: string;
}

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
const TYPE_LABEL: Record<string, string> = { JUMELE: 'JUMELÉ', MAISON: 'MAISON', MULTILOGEMENT: 'MULTILOGEMENT' };

// react-pdf exige des valeurs littérales (pas de tokens CSS). Valeurs alignées
// sur le design system DG.
const DG_RED = '#DC2626';
const GRIS_TERMINE = '#F4F3F1';
const MOIS_BG = '#EDEBE6';
const HEAD_BG = '#F0EFEC';
const BORDER = '#D8D6D1';
const INK = '#1F1D1B';
const MUTED = '#6B6862';

function startOfDay(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

export function EcheancierTableauPDF({ projet, parametres, avecFournisseur, logoBase64: initialLogo }: EcheancierTableauPDFProps) {
  const [logoBase64, setLogoBase64] = useState<string | undefined>(initialLogo);

  useEffect(() => {
    if (logoBase64) return;
    fetch('/habitationsdg.png')
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => { /* sans logo si le PNG est absent */ });
  }, [logoBase64]);

  const typeAffiche = TYPE_LABEL[projet.typeProjet] || projet.typeProjet || '';
  const today = startOfDay(new Date());

  const taches = [...(projet.taches || [])].sort((a: any, b: any) => a.ordre - b.ordre);
  const total = taches.length;
  const done = taches.filter((t: any) => calculateTaskStatus(t.dateDebut, t.dateFin).status === 'completed').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // MAJ = date de dernière modification du cédule (max updatedAt des tâches).
  const majTimes = taches.map((t: any) => (t.updatedAt ? new Date(t.updatedAt).getTime() : 0)).filter(Boolean);
  const majDate = majTimes.length ? new Date(Math.max(...majTimes)) : (projet.updatedAt ? new Date(projet.updatedAt) : new Date());
  const majStr = majDate.toLocaleDateString('fr-CA');

  // Largeurs de colonnes (LETTER portrait, contenu ≈ 540 pt).
  const W_DATE = 110;
  const W_FOURN = avecFournisseur ? 150 : 0;
  const W_DESC = 540 - W_DATE - W_FOURN;
  const W_TABLE = W_DATE + W_DESC + W_FOURN;

  // Construit la séquence de rangées : séparateurs de mois, marqueur AUJOURD'HUI
  // (position chronologique), et tâches — dans l'ordre du cédule (ordre).
  type Row =
    | { kind: 'mois'; label: string }
    | { kind: 'today' }
    | { kind: 'tache'; t: any; dateLabel: string; completed: boolean };
  const rows: Row[] = [];
  let lastMonthKey: string | null = null;
  let todayDone = false;
  for (const t of taches) {
    const d = t.dateDebut ? startOfDay(new Date(t.dateDebut)) : null;
    if (!todayDone && d && d.getTime() >= today.getTime()) {
      rows.push({ kind: 'today' });
      todayDone = true;
    }
    if (d) {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key !== lastMonthKey) {
        rows.push({ kind: 'mois', label: MOIS[d.getMonth()] });
        lastMonthKey = key;
      }
    }
    const completed = calculateTaskStatus(t.dateDebut, t.dateFin).status === 'completed';
    const dd = t.dateDebut ? new Date(t.dateDebut) : null;
    const dateLabel = dd ? `${JOURS[dd.getDay()]} ${dd.getDate()}` : '';
    rows.push({ kind: 'tache', t, dateLabel, completed });
  }
  if (!todayDone) rows.push({ kind: 'today' }); // aujourd'hui après toutes les tâches

  const styles = StyleSheet.create({
    page: { paddingTop: 34, paddingHorizontal: 36, paddingBottom: 40, fontFamily: 'Helvetica', fontSize: 9, color: INK },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logo: { width: 54, height: 40, objectFit: 'contain' },
    company: { fontSize: 12, fontWeight: 'bold' },
    rbq: { fontSize: 8, color: MUTED, marginTop: 1 },
    title: { fontSize: 12, fontWeight: 'bold', textAlign: 'right', maxWidth: 250 },
    clientBlock: { borderWidth: 1, borderColor: BORDER, borderRadius: 4, padding: 8, marginBottom: 8 },
    cRow: { flexDirection: 'row', marginBottom: 2 },
    cItem: { flexDirection: 'row', flex: 1 },
    cLabel: { fontSize: 7.5, color: MUTED, width: 56 },
    cValue: { fontSize: 9, flex: 1 },
    avancement: { fontSize: 9.5, fontWeight: 'bold', marginBottom: 8 },
    table: { borderTopWidth: 1, borderLeftWidth: 1, borderColor: BORDER },
    row: { flexDirection: 'row' },
    headRow: { backgroundColor: HEAD_BG },
    cell: { borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER, paddingVertical: 4, paddingHorizontal: 5, fontSize: 9 },
    headCell: { fontWeight: 'bold', fontSize: 8.5 },
    moisRow: { flexDirection: 'row', backgroundColor: MOIS_BG, borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER },
    moisText: { width: W_TABLE, paddingVertical: 3, paddingHorizontal: 6, fontSize: 8.5, fontWeight: 'bold', letterSpacing: 1 },
    todayRow: { flexDirection: 'row', backgroundColor: DG_RED, borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER },
    todayText: { width: W_TABLE, paddingVertical: 2, fontSize: 7.5, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', letterSpacing: 1 },
    footer: { position: 'absolute', bottom: 20, left: 36, right: 36, fontSize: 7.5, color: MUTED, textAlign: 'right' },
  });

  const champ = (label: string, value: string) => (
    <View style={styles.cItem}>
      <Text style={styles.cLabel}>{label}</Text>
      <Text style={styles.cValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* En-tête (page 1) */}
        <View style={styles.header}>
          <View style={styles.brand}>
            {logoBase64 && <Image src={logoBase64} style={styles.logo} />}
            <View>
              <Text style={styles.company}>Habitations DG</Text>
              <Text style={styles.rbq}>RBQ : {parametres?.rbq ?? '5856-1036-01'}</Text>
            </View>
          </View>
          <Text style={styles.title}>ÉCHÉANCIER DES TRAVAUX &quot;{typeAffiche}&quot;</Text>
        </View>

        {/* Bloc client */}
        <View style={styles.clientBlock}>
          <View style={styles.cRow}>
            {champ('Client(s)', `${projet.client?.prenom ?? ''} ${projet.client?.nom ?? ''}`.trim())}
            {champ('Adresse', `${projet.adresse ?? ''}${projet.ville ? `, ${projet.ville}` : ''}`)}
          </View>
          <View style={styles.cRow}>
            {champ('Téléphone', projet.client?.telephone ?? '')}
            {champ('Courriel', projet.client?.email ?? '')}
          </View>
          <View style={styles.cRow}>
            {champ('Livraison le', projet.dateLivraison ? new Date(projet.dateLivraison).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '')}
            {champ('MAJ', majStr)}
          </View>
        </View>

        {/* Avancement (date-based, live) */}
        <Text style={styles.avancement}>Avancement : {pct}% ({done}/{total} étapes terminées)</Text>

        {/* Tableau */}
        <View style={styles.table}>
          {/* En-tête de colonnes — répété à chaque page */}
          <View style={[styles.row, styles.headRow]} fixed>
            <Text style={[styles.cell, styles.headCell, { width: W_DATE }]}>Date prévue</Text>
            <Text style={[styles.cell, styles.headCell, { width: W_DESC }]}>Description des travaux</Text>
            {avecFournisseur && <Text style={[styles.cell, styles.headCell, { width: W_FOURN }]}>Fournisseur</Text>}
          </View>

          {rows.map((r, i) => {
            if (r.kind === 'mois') {
              return (
                <View key={`m${i}`} style={styles.moisRow} wrap={false}>
                  <Text style={styles.moisText}>{r.label}</Text>
                </View>
              );
            }
            if (r.kind === 'today') {
              return (
                <View key={`t${i}`} style={styles.todayRow} wrap={false}>
                  <Text style={styles.todayText}>AUJOURD&apos;HUI</Text>
                </View>
              );
            }
            return (
              <View key={r.t.id ?? `r${i}`} style={[styles.row, { backgroundColor: r.completed ? GRIS_TERMINE : '#FFFFFF' }]} wrap={false}>
                <Text style={[styles.cell, { width: W_DATE }]}>{r.dateLabel}</Text>
                <Text style={[styles.cell, { width: W_DESC }]}>{r.t.nom}</Text>
                {avecFournisseur && <Text style={[styles.cell, { width: W_FOURN }]}>{r.t.assigneA || ''}</Text>}
              </View>
            );
          })}
        </View>

        {/* Pied de page — fixe en bas, répété à chaque page */}
        <Text style={styles.footer} fixed>m.a.j.: {majStr}</Text>
      </Page>
    </Document>
  );
}
