'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tache } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GanttChart } from './gantt-chart';
import { TacheDialog } from './tache-dialog';
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { calculateTaskStatus } from '@/lib/task-status';
import { creerMoteurCedule, type Periode } from '@/lib/cedula-utils';

interface CeduleTabProps {
  taches: Tache[];
  projectId: string;
  toleranceJours?: number;
  dateLivraison?: string | Date | null;
  margeCeduleJours?: number;
  periodes?: Periode[];
  onModifierClick?: () => void;
}

export function CeduleTab({ taches, projectId, toleranceJours, dateLivraison, margeCeduleJours, periodes, onModifierClick }: CeduleTabProps) {
  const router = useRouter();
  const { subJoursOuvrables } = useMemo(() => creerMoteurCedule(periodes), [periodes]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTache, setSelectedTache] = useState<any>(null);
  const [insertAfterOrdre, setInsertAfterOrdre] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [modeEdition, setModeEdition] = useState(false);

  // #9-B — Changer le template d'une cédule existante
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);
  const [changeStep, setChangeStep] = useState<'select' | 'warn'>('select');
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [chosenTemplateId, setChosenTemplateId] = useState('');
  const [regenerating, setRegenerating] = useState(false);

  const TYPE_LABEL: Record<string, string> = { JUMELE: 'Jumelé', MAISON: 'Maison', MULTILOGEMENT: 'Multilogement' };

  const openChangeTemplate = async () => {
    setChosenTemplateId('');
    setChangeStep('select');
    setShowChangeTemplate(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setAvailableTemplates(data.templates || []);
    } catch {
      setAvailableTemplates([]);
    }
  };

  // Régénère les Tache du projet depuis le template choisi (cascade à rebours
  // depuis la livraison). Les feuilles de temps et dépenses ne sont PAS touchées
  // (aucune FK vers Tache) — l'historique financier est préservé.
  const regenererDepuisTemplate = async () => {
    const template = availableTemplates.find((t) => t.id === chosenTemplateId);
    if (!template || !dateLivraison) return;
    setRegenerating(true);
    try {
      const livraison = new Date(dateLivraison);
      const marge = margeCeduleJours ?? 5;
      let cursor = subJoursOuvrables(livraison, marge);
      const src = [...template.etapes].sort((a: any, b: any) => a.ordre - b.ordre);
      const computed: any[] = [];
      for (let i = src.length - 1; i >= 0; i--) {
        const e = src[i];
        const dateFin = new Date(cursor);
        const dateDebut = e.joursDefaut <= 1 ? new Date(cursor) : subJoursOuvrables(cursor, e.joursDefaut - 1);
        cursor = subJoursOuvrables(dateDebut, 1);
        computed.unshift({
          nom: e.nom,
          ordre: e.ordre,
          dureeJours: e.joursDefaut,
          dateDebut: dateDebut.toISOString(),
          dateFin: dateFin.toISOString(),
          assigneA: e.assigneA ?? null,
          visibleClient: e.visibleClient,
          interne: e.interne,
          buffer: 0,
        });
      }
      const res = await fetch(`/api/projets/${projectId}/cedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapes: computed }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Échec de la régénération'); }
      router.refresh();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
      setRegenerating(false);
    }
  };

  const handleAddTache = () => {
    setSelectedTache(null);
    setInsertAfterOrdre(null);
    setDialogOpen(true);
  };

  const handleAddAfter = (ordre: number) => {
    setSelectedTache(null);
    setInsertAfterOrdre(ordre);
    setDialogOpen(true);
  };

  const handleEditTache = (tache: Tache) => {
    setSelectedTache(tache);
    setDialogOpen(true);
  };

  const handleSaveTache = async (data: any) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/taches/${data.id}` : '/api/taches';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projetId: projectId,
          nom: data.nom || '',
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
          dureeJours: data.dureeJours || 1,
          assigneA: data.assigneA || null,
          visibleClient: data.visibleClient !== undefined ? data.visibleClient : false,
          ordre: data.ordre,
          description: data.description || null,
          interne: data.interne || false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      // Rafraîchir via le Server Component (router.refresh) — plus de reload complet.
      router.refresh();
      setDialogOpen(false);
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bouton Ajouter */}
      <div className="flex justify-end">
        <Button onClick={handleAddTache} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Ajouter une étape
        </Button>
      </div>

      {/* Gantt Chart */}
      {taches.length > 0 ? (
        <GanttChart
          taches={taches}
          projectId={projectId}
          toleranceJours={toleranceJours || 3}
        />
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-200">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-900">
              Diagramme de Gantt
            </h3>
            <p className="text-blue-700 text-sm">
              Aucune étape définie pour le moment
            </p>
          </div>
        </div>
      )}

      {/* Tableau Détail des étapes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Détail des étapes</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={openChangeTemplate}
              style={{
                padding: '8px 14px',
                background: 'white',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <i className='ti ti-template' /> Changer le template
            </button>
            {onModifierClick && (
              <button
                onClick={onModifierClick}
                style={{
                  padding: '8px 14px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <i className='ti ti-edit' /> Modifier la cédule
              </button>
            )}
          </div>
        </div>

        {taches.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Aucune étape définie</p>
        ) : (
          <div style={{ width: '75%', minWidth: '600px' }} className="border border-gray-200 rounded-lg overflow-x-auto">
            {/* Header */}
            <div className="flex bg-gray-100 border-b border-gray-200 font-semibold text-xs text-gray-700" style={{ minWidth: 'min-content' }}>
              <div style={{ width: '40px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>N°</div>
              <div style={{ width: '220px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>Étape</div>
              <div style={{ width: '180px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>Début</div>
              <div style={{ width: '180px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>Fin</div>
              <div style={{ width: '120px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>Durée</div>
              <div style={{ width: '320px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>Assigné à</div>
              <div style={{ width: '80px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }} className="flex items-center justify-center">Vue client</div>
              <div style={{ width: '80px', padding: '12px', whiteSpace: 'nowrap' }}>Actions</div>
            </div>

            {/* Lignes */}
            <div style={{ minWidth: 'min-content' }}>
              {taches.map((tache, idx) => {
                const status = calculateTaskStatus(tache.dateDebut, tache.dateFin);
                const debutFr = tache.dateDebut ? new Date(tache.dateDebut as string | Date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                }).replace('.', '').replace(' ', ' ') : '—';
                const finFr = tache.dateFin ? new Date(tache.dateFin as string | Date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                }).replace('.', '').replace(' ', ' ') : '—';

                return (
                  <div key={tache.id}>
                    {/* Zone invisible pour bouton + */}
                    {idx > 0 && (
                      <div
                        style={{ height: '8px', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                        onClick={() => handleAddAfter(tache.ordre - 1)}
                        className="flex items-center justify-center hover:opacity-100 relative"
                      >
                        <div className="absolute w-full h-px bg-gray-300" style={{ borderTop: '1px dashed #d1d5db' }}></div>
                        <button className="relative bg-white px-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Ligne étape */}
                    <div
                      className={`flex border-b border-gray-200 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                      style={{ minWidth: 'min-content' }}
                    >
                      <div style={{ width: '40px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }} className="text-sm font-medium text-gray-900">
                        {tache.ordre}
                      </div>
                      <div style={{ width: '220px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }} className="text-sm text-gray-900">
                        {tache.nom}
                      </div>
                      {/* Début */}
                      <div
                        style={{ width: '180px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}
                        className="text-sm text-gray-600 cursor-text"
                        onDoubleClick={() => {
                          setEditingId(tache.id);
                          setEditingField('dateDebut');
                          setEditValue(tache.dateDebut);
                        }}
                      >
                        {editingId === tache.id && editingField === 'dateDebut' ? (
                          <input
                            type="date"
                            value={typeof editValue === 'string' ? editValue.split('T')[0] : editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTache({ ...tache, dateDebut: editValue });
                                setEditingId(null);
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            onBlur={() => {
                              handleSaveTache({ ...tache, dateDebut: editValue });
                              setEditingId(null);
                            }}
                            autoFocus
                            className="w-full p-1 border border-blue-400 rounded"
                          />
                        ) : (
                          debutFr
                        )}
                      </div>

                      {/* Fin */}
                      <div
                        style={{ width: '180px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}
                        className="text-sm text-gray-600 cursor-text"
                        onDoubleClick={() => {
                          setEditingId(tache.id);
                          setEditingField('dateFin');
                          setEditValue(tache.dateFin);
                        }}
                      >
                        {editingId === tache.id && editingField === 'dateFin' ? (
                          <input
                            type="date"
                            value={typeof editValue === 'string' ? editValue.split('T')[0] : editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTache({ ...tache, dateFin: editValue });
                                setEditingId(null);
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            onBlur={() => {
                              handleSaveTache({ ...tache, dateFin: editValue });
                              setEditingId(null);
                            }}
                            autoFocus
                            className="w-full p-1 border border-blue-400 rounded"
                          />
                        ) : (
                          finFr
                        )}
                      </div>

                      {/* Durée */}
                      <div
                        style={{ width: '120px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}
                        className="text-sm text-gray-600 cursor-text"
                        onDoubleClick={() => {
                          setEditingId(tache.id);
                          setEditingField('dureeJours');
                          setEditValue(tache.dureeJours);
                        }}
                      >
                        {editingId === tache.id && editingField === 'dureeJours' ? (
                          <input
                            type="number"
                            min="1"
                            value={editValue}
                            onChange={(e) => setEditValue(parseInt(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTache({ ...tache, dureeJours: editValue });
                                setEditingId(null);
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            onBlur={() => {
                              handleSaveTache({ ...tache, dureeJours: editValue });
                              setEditingId(null);
                            }}
                            autoFocus
                            className="w-full p-1 border border-blue-400 rounded"
                          />
                        ) : (
                          `${tache.dureeJours}j ouvr.`
                        )}
                      </div>

                      {/* Assigné à */}
                      <div
                        style={{ width: '320px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}
                        className="text-sm text-gray-600 cursor-text"
                        onDoubleClick={() => {
                          setEditingId(tache.id);
                          setEditingField('assigneA');
                          setEditValue(tache.assigneA || '');
                        }}
                      >
                        {editingId === tache.id && editingField === 'assigneA' ? (
                          <select
                            value={editValue || ''}
                            onChange={(e) => setEditValue(e.target.value || null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTache({ ...tache, assigneA: editValue });
                                setEditingId(null);
                              } else if (e.key === 'Escape') {
                                setEditingId(null);
                              }
                            }}
                            onBlur={() => {
                              handleSaveTache({ ...tache, assigneA: editValue });
                              setEditingId(null);
                            }}
                            autoFocus
                            className="w-full p-1 border border-blue-400 rounded"
                          >
                            <option value="">Interne</option>
                            <option value="Plomberie Côté">Plomberie Côté</option>
                            <option value="Élec. Vachon">Élec. Vachon</option>
                            <option value="Ventil. Express">Ventil. Express</option>
                            <option value="Cuisines Beauce">Cuisines Beauce</option>
                            <option value="Gypse Beauce">Gypse Beauce</option>
                            <option value="Céramique Plus">Céramique Plus</option>
                            <option value="Peinture Martin">Peinture Martin</option>
                          </select>
                        ) : (
                          tache.assigneA || 'Interne'
                        )}
                      </div>

                      {/* Vue client toggle */}
                      <div style={{ width: '80px', padding: '12px', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap' }} className="flex items-center justify-center cursor-pointer">
                        <button onClick={() => {
                          const newVisibility = !tache.visibleClient;
                          handleSaveTache({ ...tache, visibleClient: newVisibility });
                        }}>
                          {tache.visibleClient ? (
                            <Eye className="w-4 h-4 text-green-600 hover:text-blue-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          )}
                        </button>
                      </div>
                      <div style={{ width: '80px', padding: '12px', whiteSpace: 'nowrap' }} className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleEditTache(tache)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled
                          title="Bientôt disponible"
                          className="p-1 text-gray-300 cursor-not-allowed rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Zone invisible + après la dernière étape */}
              {taches.length > 0 && (
                <div
                  style={{ height: '8px', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  onClick={() => handleAddAfter(taches[taches.length - 1].ordre)}
                  className="flex items-center justify-center hover:opacity-100 relative"
                >
                  <div className="absolute w-full h-px" style={{ borderTop: '1px dashed #d1d5db' }}></div>
                  <button className="relative bg-white px-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialog Ajouter/Éditer étape */}
      <TacheDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tache={selectedTache}
        projectId={projectId}
        onSave={handleSaveTache}
      />

      {/* #9-B — Changer le template (sélection → avertissement → régénération) */}
      {showChangeTemplate && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={() => { if (!regenerating) setShowChangeTemplate(false); }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, padding: 24, maxWidth: 480, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            {changeStep === 'select' ? (
              <>
                <h3 className="text-lg font-bold text-gray-900">Changer le template de la cédule</h3>
                <p className="text-sm text-gray-600 mt-2">Choisissez le template à appliquer. La cédule actuelle sera régénérée à l'étape suivante.</p>
                {!dateLivraison ? (
                  <p className="text-sm mt-4" style={{ color: 'var(--danger-text)' }}>
                    Ce projet n'a pas de date de livraison : impossible de recalculer la cédule. Définissez-la d'abord.
                  </p>
                ) : (
                  <select
                    value={chosenTemplateId}
                    onChange={(e) => setChosenTemplateId(e.target.value)}
                    className="w-full mt-4 p-2 border border-gray-300 rounded"
                  >
                    <option value="">Choisir un template…</option>
                    {availableTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.nom} — {TYPE_LABEL[t.type] || t.type} ({t.etapes?.length ?? 0} étapes)</option>
                    ))}
                  </select>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowChangeTemplate(false)}>Annuler</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!chosenTemplateId || !dateLivraison} onClick={() => setChangeStep('warn')}>
                    Continuer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la régénération</h3>
                <p className="text-sm text-gray-600 mt-3">En appliquant ce template, ces éléments de la cédule seront <b>régénérés</b> :</p>
                <ul className="text-sm text-gray-600 mt-2 list-disc pl-5 space-y-1">
                  <li>les étapes (ajoutées / retirées selon le template) ;</li>
                  <li>les dates de début et de fin (recalculées depuis la livraison) ;</li>
                  <li>l'avancement (calculé d'après les nouvelles dates) ;</li>
                  <li>les assignations de fournisseurs (reprises du template).</li>
                </ul>
                <p className="text-sm mt-3" style={{ color: 'var(--success-text)' }}>
                  Conservés : les feuilles de temps et les dépenses déjà enregistrées (historique financier).
                </p>
                <p className="text-sm text-gray-500 mt-2">Action irréversible.</p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" disabled={regenerating} onClick={() => setChangeStep('select')}>Retour</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={regenerating} onClick={regenererDepuisTemplate}>
                    {regenerating ? 'Régénération…' : 'Régénérer la cédule'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
