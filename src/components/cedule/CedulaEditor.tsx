'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Trash2, ChevronRight, RefreshCw, Link2, Unlink } from 'lucide-react';
import {
  EtapeEditable,
  detecterConflits,
  creerMoteurCedule,
  type Periode,
} from '@/lib/cedula-utils';
import { formatDate } from '@/lib/utils';

export interface CedulaEditorProps {
  typeProjet: 'MAISON' | 'JUMELE';
  dateLivraison: Date;
  fournisseurs: { nom: string }[];
  mode?: 'creation' | 'projet';
  onChange: (etapes: EtapeEditable[]) => void;
  onValider?: () => void;
  etapesInitiales?: EtapeEditable[];
  margeCeduleJours?: number;
  toleranceJours?: number;
  templateId?: string; // #9 — si fourni, charge/réinitialise depuis CE template (sinon défaut par type)
  periodes?: Periode[]; // jours non ouvrables (vacances/fériés) — moteur de cédule
}

export default function CedulaEditor({
  typeProjet,
  dateLivraison,
  fournisseurs,
  mode = 'creation',
  onChange,
  onValider,
  etapesInitiales = [],
  margeCeduleJours = 5,
  templateId,
  periodes,
}: CedulaEditorProps) {
  const [etapes, setEtapes] = useState<EtapeEditable[]>([]);
  const [conflits, setConflits] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Moteur conscient des vacances : helpers + cascade LIÉS au prédicat construit
  // depuis les périodes. Sans période → prédicat weekend → dates IDENTIQUES.
  const { addJoursOuvrables, subJoursOuvrables, joursOuvrableEntre, cascadeVersBas, cascadeVersHaut, validerGroupes, genererGroupeId } =
    useMemo(() => creerMoteurCedule(periodes), [periodes]);

  console.log('CedulaEditor props:', { typeProjet, dateLivraison: dateLivraison.toISOString(), etapesCount: etapes.length });

  // Charger le template — mais seulement si etapesInitiales n'est pas fourni
  useEffect(() => {
    // Si etapesInitiales fourni et non-vide, l'utiliser directement (retour de Confirmation)
    if (etapesInitiales && etapesInitiales.length > 0) {
      const restoredEtapes = etapesInitiales.map(e => ({
        ...e,
        buffer: e.buffer ?? 0,
        dateDebut: e.dateDebut instanceof Date ? e.dateDebut : new Date(e.dateDebut),
        dateFin: e.dateFin instanceof Date ? e.dateFin : new Date(e.dateFin),
      }));
      setEtapes(restoredEtapes);
      return;
    }

    // Sinon, charger le template par défaut DEPUIS LA DB (jamais un fichier au runtime).
    let annule = false;
    const chargerTemplateDB = async () => {
      try {
        // #9 — depuis le template CHOISI si fourni, sinon le défaut par type.
        const url = templateId ? `/api/templates/${templateId}` : `/api/templates?type=${typeProjet}`;
        const res = await fetch(url);
        const data = res.ok ? await res.json() : null;
        const template = templateId ? data?.template : data;
        const dbEtapes: any[] = template?.etapes ?? [];

        const newEtapes: EtapeEditable[] = dbEtapes.map((e: any, i: number) => ({
          id: undefined,
          nom: e.nom,
          ordre: i + 1,
          jours: e.joursDefaut,
          dateDebut: new Date(),
          dateFin: new Date(),
          buffer: 0,
          assigneA: e.assigneA || 'Interne',
          visibleClient: e.visibleClient,
          interne: e.interne,
        }));

        // Calcul dates à rebours depuis dateLivraison - margeCeduleJours
        const ancre = subJoursOuvrables(dateLivraison, margeCeduleJours);
        let cursor = new Date(ancre);
        for (let i = newEtapes.length - 1; i >= 0; i--) {
          const e = newEtapes[i];
          e.dateFin = new Date(cursor);
          e.dateDebut = e.jours <= 1
            ? new Date(cursor)
            : subJoursOuvrables(cursor, e.jours - 1);
          const bufferPrec = i > 0 ? newEtapes[i - 1].buffer : 0;
          cursor = subJoursOuvrables(e.dateDebut, 1 + bufferPrec);
        }

        if (!annule) {
          setEtapes(newEtapes);
          onChange(newEtapes);
        }
      } catch (err) {
        console.error('Erreur chargement template (DB):', err);
      }
    };
    chargerTemplateDB();
    return () => { annule = true; };
  }, []); // ← s'exécute UNE SEULE FOIS au montage

  // Détecter conflits
  useEffect(() => {
    const newConflits = detecterConflits(etapes);
    setConflits(newConflits);
  }, [etapes]);

  // Notifier le parent de tous les changements avec propriétés bien sérialisées
  useEffect(() => {
    if (etapes.length > 0) {
      onChange(etapes.map(e => ({
        ...e,
        buffer: e.buffer ?? 0,
        dateDebut: e.dateDebut instanceof Date ? e.dateDebut : new Date(e.dateDebut),
        dateFin: e.dateFin instanceof Date ? e.dateFin : new Date(e.dateFin),
      })));
    }
  }, [etapes]);

  const totalJoursTravail = etapes.length > 0
    ? joursOuvrableEntre(etapes[0].dateDebut, dateLivraison)
    : 0;
  const totalBuffer = etapes.reduce((sum, e) => sum + (e.buffer || 0), 0);
  const totalJours = totalJoursTravail + totalBuffer;

  const isOverflow = etapes.length > 0 && etapes[etapes.length - 1].dateFin > dateLivraison;

  const handleDateDebutChange = (idx: number, offset: number) => {
    const newEtapes = [...etapes];
    newEtapes[idx].dateDebut = addJoursOuvrables(newEtapes[idx].dateDebut, offset);
    newEtapes[idx].dateFin = newEtapes[idx].jours <= 1
      ? new Date(newEtapes[idx].dateDebut)
      : addJoursOuvrables(newEtapes[idx].dateDebut, newEtapes[idx].jours - 1);
    const updatedEtapes = cascadeVersBas(newEtapes, idx);
    setEtapes(updatedEtapes);
    onChange(updatedEtapes);
  };

  const handleDateFinChange = (idx: number, offset: number) => {
    const newEtapes = [...etapes];
    newEtapes[idx].dateFin = addJoursOuvrables(newEtapes[idx].dateFin, offset);
    newEtapes[idx].jours = joursOuvrableEntre(newEtapes[idx].dateDebut, newEtapes[idx].dateFin);
    const updatedEtapes = cascadeVersHaut(newEtapes, idx);
    setEtapes(updatedEtapes);
    onChange(updatedEtapes);
  };

  const handleBufferChange = (idx: number, offset: number) => {
    const newEtapes = [...etapes];
    newEtapes[idx].buffer = Math.max(0, (newEtapes[idx].buffer || 0) + offset);
    const updatedEtapes = cascadeVersBas(newEtapes, idx);
    setEtapes(updatedEtapes);
    onChange(updatedEtapes);
  };

  const handleDeleteEtape = (idx: number) => {
    const filtered = etapes.filter((_, i) => i !== idx).map((e, i) => ({ ...e, ordre: i + 1 }));
    // Une suppression peut faire retomber un groupe à 1 membre → nettoyer.
    const newEtapes = validerGroupes(filtered);
    setEtapes(newEtapes);
    onChange(newEtapes);
    setShowDeleteConfirm(null);
  };

  // Une étape est « liée » (membre non-ancre) si elle partage le groupeId de la
  // précédente : elle débute le même jour et n'est pas éditable séparément.
  const estLiee = (idx: number) =>
    idx > 0 && !!etapes[idx].groupeId && etapes[idx].groupeId === etapes[idx - 1].groupeId;

  // Toggle « même jour que la précédente » (icône chaîne) sur la ligne idx.
  // Cocher → joindre au bloc de idx-1 (créer un groupeId au besoin). Décocher →
  // sortir du bloc (+ nettoyer si le groupe retombe à 1). La date du bloc reste
  // pilotée par l'ancre ; on recascade depuis le bloc précédent.
  const toggleLien = (idx: number) => {
    if (idx < 1) return;
    let next: EtapeEditable[] = etapes.map((e) => ({ ...e }));
    if (estLiee(idx)) {
      next[idx] = { ...next[idx], groupeId: null };
      next = validerGroupes(next);
    } else {
      const gPrev = next[idx - 1].groupeId;
      const g = gPrev || genererGroupeId();
      if (!gPrev) next[idx - 1] = { ...next[idx - 1], groupeId: g };
      next[idx] = { ...next[idx], groupeId: g };
      next = validerGroupes(next);
    }
    const updated = cascadeVersBas(next, Math.max(0, idx - 1));
    setEtapes(updated);
    onChange(updated);
  };

  const adjustDebutChantier = (delta: number) => {
    const nouvelleDate = delta > 0
      ? addJoursOuvrables(etapes[0].dateDebut, delta)
      : subJoursOuvrables(etapes[0].dateDebut, Math.abs(delta));
    const newEtapes = [...etapes];
    newEtapes[0].dateDebut = nouvelleDate;
    newEtapes[0].dateFin = newEtapes[0].jours <= 1
      ? new Date(nouvelleDate)
      : addJoursOuvrables(nouvelleDate, newEtapes[0].jours - 1);
    cascadeVersBas(newEtapes, 0);
    setEtapes(newEtapes);
    onChange(newEtapes);
  };

  const adjustFinChantier = (delta: number) => {
    const derniere = etapes[etapes.length - 1];
    const nouvelleDate = delta > 0
      ? addJoursOuvrables(derniere.dateFin, delta)
      : subJoursOuvrables(derniere.dateFin, Math.abs(delta));
    const newEtapes = [...etapes];
    newEtapes[newEtapes.length - 1].dateFin = nouvelleDate;
    newEtapes[newEtapes.length - 1].jours = joursOuvrableEntre(
      newEtapes[newEtapes.length - 1].dateDebut,
      nouvelleDate
    );
    cascadeVersHaut(newEtapes, newEtapes.length - 1);
    setEtapes(newEtapes);
    onChange(newEtapes);
  };

  const insererEtape = (apresIndex: number) => {
    const prev = etapes[apresIndex - 1];
    const next = etapes[apresIndex];
    const nouvelleDate = prev
      ? addJoursOuvrables(prev.dateFin, 1)
      : new Date(next.dateDebut);

    const nouvelleEtape: EtapeEditable = {
      id: undefined,
      nom: 'Nouvelle étape',
      ordre: apresIndex + 1,
      jours: 1,
      dateDebut: nouvelleDate,
      dateFin: new Date(nouvelleDate),
      buffer: 0,
      assigneA: 'Interne',
      visibleClient: true,
      interne: false,
    };

    const renum = [
      ...etapes.slice(0, apresIndex),
      nouvelleEtape,
      ...etapes.slice(apresIndex),
    ].map((e, i) => ({ ...e, ordre: i + 1 }));
    // L'insertion peut casser la contiguïté d'un bloc → re-valider les groupes.
    const newEtapes = validerGroupes(renum);

    cascadeVersBas(newEtapes, apresIndex);
    setEtapes(newEtapes);
    onChange(newEtapes);
  };

  const reinitialiserDates = async () => {
    if (!confirm('Réinitialiser toutes les dates ? Les modifications seront perdues.')) return;

    try {
      // Réinitialise depuis le template du projet (templateId) s'il résout vers
      // un template existant ; sinon (null, ou template supprimé → 404/vide) →
      // fallback gracieux sur le défaut par type.
      let dbEtapes: any[] = [];
      if (templateId) {
        const res = await fetch(`/api/templates/${templateId}`);
        if (res.ok) { const data = await res.json(); dbEtapes = data?.template?.etapes ?? []; }
      }
      if (dbEtapes.length === 0) {
        const res = await fetch(`/api/templates?type=${typeProjet}`);
        if (res.ok) { const data = await res.json(); dbEtapes = data?.etapes ?? []; }
      }

      const nouvellesEtapes: EtapeEditable[] = dbEtapes.map((e: any, i: number) => ({
        id: undefined,
        nom: e.nom,
        ordre: i + 1,
        jours: e.joursDefaut,
        dateDebut: new Date(),
        dateFin: new Date(),
        buffer: 0,
        assigneA: e.assigneA || 'Interne',
        visibleClient: e.visibleClient,
        interne: e.interne,
      }));

      const ancre = subJoursOuvrables(dateLivraison, margeCeduleJours);
      let cursor = new Date(ancre);
      for (let i = nouvellesEtapes.length - 1; i >= 0; i--) {
        const e = nouvellesEtapes[i];
        e.dateFin = new Date(cursor);
        e.dateDebut = e.jours <= 1
          ? new Date(cursor)
          : subJoursOuvrables(cursor, e.jours - 1);
        const bufferPrec = i > 0 ? nouvellesEtapes[i - 1].buffer : 0;
        cursor = subJoursOuvrables(e.dateDebut, 1 + bufferPrec);
      }

      setEtapes(nouvellesEtapes);
      onChange(nouvellesEtapes);
    } catch (err) {
      console.error('Erreur réinitialisation template (DB):', err);
    }
  };

  return (
    <div className="space-y-6" style={{ width: '100%', padding: '0 16px' }}>
      {/* Bandeau 3 cartes */}
      <div className="grid grid-cols-3 gap-4">
        
        <div style={{ padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--success-tint)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Début estimé</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--success-text)' }}>
            {etapes.length > 0 ? formatDate(etapes[0].dateDebut) : '—'}
          </p>
        </div>
        <div style={{ padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-border)', background: 'var(--dg-red-50)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Date de livraison</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--dg-red-700)' }}>
            {formatDate(dateLivraison)}
          </p>
        </div>
        <div style={{ padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Total</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{totalJours} jours ouvrables</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={reinitialiserDates} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Alertes */}
      {isOverflow && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ La cédule dépasse la date de livraison
          </p>
        </div>
      )}
      {conflits.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ {Math.ceil(conflits.length / 2)} conflit(s) détecté(s)
          </p>
        </div>
      )}

      {/* Tableau */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="text-sm w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '40px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '320px' }} />
            <col style={{ width: '320px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '160px' }} />
            <col style={{ width: '50px' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b">
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '280px' }} className="px-3 py-2 text-left font-semibold">Étape</th>
              <th style={{ width: '70px' }} className="px-3 py-2 text-left font-semibold">Jours</th>
              <th style={{ width: '320px' }} className="px-3 py-2 text-left font-semibold">Date début</th>
              <th style={{ width: '320px' }} className="px-3 py-2 text-left font-semibold">Fin</th>
              <th style={{ width: '130px' }} className="px-3 py-2 text-left font-semibold">Buffer</th>
              <th style={{ width: '200px' }} className="px-3 py-2 text-left font-semibold">Assigné</th>
              <th style={{ width: '50px' }} className="px-3 py-2 text-center font-semibold">Vue client</th>
            </tr>
          </thead>
          <tbody>
            {/* Ligne Début du chantier */}
            {etapes.length > 0 && (
              <tr style={{ background: '#F8FFFE', borderBottom: '1px solid #E1F5EE' }}>
                <td></td>
                <td style={{ padding: '8px 12px', fontWeight: 500, color: '#0F6E56' }}>
                  📅 Début du chantier
                </td>
                <td></td>
                <td>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 28px 28px 110px 28px 28px 28px',
                    gap: '3px'
                  }}>
                    <button onClick={() => adjustDebutChantier(-5)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-5</button>
                    <button onClick={() => adjustDebutChantier(-3)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-3</button>
                    <button onClick={() => adjustDebutChantier(-1)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-1</button>
                    <span style={{ width: '110px', textAlign: 'center', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formatDate(etapes[0]?.dateDebut)}
                    </span>
                    <button onClick={() => adjustDebutChantier(1)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+1</button>
                    <button onClick={() => adjustDebutChantier(3)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+3</button>
                    <button onClick={() => adjustDebutChantier(5)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+5</button>
                  </div>
                </td>
                <td colSpan={4}></td>
              </tr>
            )}

            {/* Étapes avec tous les boutons */}
            {etapes.map((e, idx) => {
              const isConflict = conflits.includes(idx);
              const estLie = estLiee(idx);
              return (
                <Fragment key={`etape-${idx}`}>
                  <tr
                    style={{ height: '8px', position: 'relative', cursor: 'pointer' }}
                    onClick={() => insererEtape(idx)}
                  >
                    <td colSpan={8} style={{ padding: 0, position: 'relative' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E1F5EE'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '10px',
                        color: '#1D9E75',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        opacity: 0,
                      }}
                      className='insert-label'
                      >
                        + Insérer une étape
                      </div>
                    </td>
                  </tr>
                  <style>{`tr:hover .insert-label { opacity: 1 !important; }`}</style>
                  <tr
                    key={idx}
                  className={`group ${isConflict ? 'bg-red-50 border-l-4 border-red-500' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td style={{ width: '40px' }} className="px-3 py-2">{e.ordre}</td>
                  <td style={{ width: '280px' }} className="px-3 py-2">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {idx > 0 ? (
                        <button
                          type="button"
                          onClick={() => toggleLien(idx)}
                          title={estLie ? 'Délier — redevient une étape indépendante' : 'Lier — même jour que la précédente'}
                          aria-label={estLie ? 'Délier de la précédente' : 'Lier à la précédente'}
                          style={{
                            flex: '0 0 auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 22, height: 22, borderRadius: 4,
                            color: estLie ? 'var(--phase-signe-ink)' : 'var(--text-disabled)',
                            background: estLie ? 'var(--phase-signe-tint)' : 'transparent',
                            cursor: 'pointer', border: 'none', padding: 0,
                          }}
                        >
                          {estLie ? <Link2 className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <span style={{ flex: '0 0 auto', width: 22 }} />
                      )}
                      <span style={{ color: estLie ? 'var(--text-secondary)' : 'inherit' }}>
                        {estLie ? '↳ ' : ''}{e.nom}
                      </span>
                    </div>
                  </td>
                  <td style={{ width: '70px' }} className="px-3 py-2">{e.jours}j</td>

                  {/* Date début avec boutons (membre lié = date pilotée par l'ancre, lecture seule) */}
                  <td style={{ width: '320px' }} className="px-3 py-2">
                    {estLie ? (
                      <div style={{ height: '28px', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: 12, fontStyle: 'italic' }} title="Date pilotée par l'étape ancre du bloc — modifiez l'ancre pour décaler tout le bloc.">
                        <Link2 className="w-3.5 h-3.5" />
                        {formatDate(e.dateDebut)} · même jour
                      </div>
                    ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 28px 28px 110px 28px 28px 28px',
                      gap: '2px',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      {[-5, -3, -1].map(offset => (
                        <button
                          key={offset}
                          onClick={() => handleDateDebutChange(idx, offset)}
                          className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                          style={{ height: '28px', padding: 0 }}
                        >
                          {offset}
                        </button>
                      ))}
                      <div className="text-xs text-center px-2 py-1 bg-blue-50 border border-blue-200 rounded font-semibold" style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formatDate(e.dateDebut)}
                      </div>
                      {[1, 3, 5].map(offset => (
                        <button
                          key={offset}
                          onClick={() => handleDateDebutChange(idx, offset)}
                          className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                          style={{ height: '28px', padding: 0 }}
                        >
                          +{offset}
                        </button>
                      ))}
                    </div>
                    )}
                  </td>

                  {/* Fin avec boutons (membre lié = lecture seule ; durée propre conservée) */}
                  <td style={{ width: '320px' }} className="px-3 py-2">
                    {estLie ? (
                      <div style={{ height: '28px', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: 12, fontStyle: 'italic' }} title="Fin calculée d'après la durée propre de l'étape — le bloc est piloté par l'ancre.">
                        <Link2 className="w-3.5 h-3.5" />
                        {formatDate(e.dateFin)}
                      </div>
                    ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 28px 28px 110px 28px 28px 28px',
                      gap: '2px',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      {[-5, -3, -1].map(offset => (
                        <button
                          key={offset}
                          onClick={() => handleDateFinChange(idx, offset)}
                          className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                          style={{ height: '28px', padding: 0 }}
                        >
                          {offset}
                        </button>
                      ))}
                      <div className="text-xs text-center px-2 py-1 bg-blue-50 border border-blue-200 rounded font-semibold" style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formatDate(e.dateFin)}
                      </div>
                      {[1, 3, 5].map(offset => (
                        <button
                          key={offset}
                          onClick={() => handleDateFinChange(idx, offset)}
                          className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                          style={{ height: '28px', padding: 0 }}
                        >
                          +{offset}
                        </button>
                      ))}
                    </div>
                    )}
                  </td>

                  {/* Buffer avec -1 [valeur] +1 */}
                  <td style={{ width: '130px' }} className="px-3 py-2">
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 50px 28px',
                      gap: '2px',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <button
                        onClick={() => handleBufferChange(idx, -1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                        style={{ height: '28px', padding: 0 }}
                      >
                        -1
                      </button>
                      <div className={`text-xs text-center font-semibold py-1 rounded ${e.buffer > 0 ? 'bg-orange-200 text-orange-900' : 'bg-gray-100 text-gray-900'}`}>
                        {e.buffer} j
                      </div>
                      <button
                        onClick={() => handleBufferChange(idx, 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium"
                        style={{ height: '28px', padding: 0 }}
                      >
                        +1
                      </button>
                    </div>
                  </td>

                  {/* Assigné Select */}
                  <td style={{ width: '200px' }} className="px-3 py-2">
                    <Select
                      value={e.assigneA || 'Interne'}
                      onValueChange={(val) => {
                        const newEtapes = [...etapes];
                        newEtapes[idx].assigneA = val === 'Interne' ? 'Interne' : val;
                        setEtapes(newEtapes);
                        onChange(newEtapes);
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interne">Interne</SelectItem>
                        {fournisseurs.map(f => (
                          <SelectItem key={f.nom} value={f.nom}>{f.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Eye toggle + Trash au hover */}
                  <td style={{ width: '50px' }} className="px-3 py-2 text-center group relative">
                    <div className="flex items-center justify-center gap-1">
                      {showDeleteConfirm === idx ? (
                        <div className="flex gap-1 absolute right-0 bg-white border rounded shadow-lg p-1 z-50">
                          <button
                            onClick={() => handleDeleteEtape(idx)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400"
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              const newEtapes = [...etapes];
                              newEtapes[idx].visibleClient = !newEtapes[idx].visibleClient;
                              setEtapes(newEtapes);
                              onChange(newEtapes);
                            }}
                            className="hover:text-blue-600"
                          >
                            {e.visibleClient ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(idx)}
                            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                </Fragment>
              );
            })}

            {/* Ligne Fin de chantier */}
            {etapes.length > 0 && (
              <tr style={{ background: '#F8FFFE', borderTop: '1px solid #E1F5EE' }}>
                <td></td>
                <td style={{ padding: '8px 12px', fontWeight: 500, color: '#0F6E56' }}>
                  🏁 Fin de chantier
                </td>
                <td></td>
                <td>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 28px 28px 110px 28px 28px 28px',
                    gap: '3px'
                  }}>
                    <button onClick={() => adjustFinChantier(-5)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-5</button>
                    <button onClick={() => adjustFinChantier(-3)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-3</button>
                    <button onClick={() => adjustFinChantier(-1)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>-1</button>
                    <span style={{ width: '110px', textAlign: 'center', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formatDate(etapes[etapes.length - 1]?.dateFin)}
                    </span>
                    <button onClick={() => adjustFinChantier(1)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+1</button>
                    <button onClick={() => adjustFinChantier(3)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+3</button>
                    <button onClick={() => adjustFinChantier(5)} className="bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium" style={{ height: '28px', padding: 0 }}>+5</button>
                  </div>
                </td>
                <td colSpan={4}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
