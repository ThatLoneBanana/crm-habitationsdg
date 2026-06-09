'use client';

import { useState } from 'react';
import { Tache } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GanttChart } from './gantt-chart';
import { TacheDialog } from './tache-dialog';
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { calculateTaskStatus } from '@/lib/task-status';

interface CeduleTabProps {
  taches: Tache[];
  projectId: string;
  toleranceJours?: number;
  onModifierClick?: () => void;
}

export function CeduleTab({ taches, projectId, toleranceJours, onModifierClick }: CeduleTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTache, setSelectedTache] = useState<any>(null);
  const [insertAfterOrdre, setInsertAfterOrdre] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [modeEdition, setModeEdition] = useState(false);

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

      // Rafraîchir les données sans reload
      window.location.reload();
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
                          onClick={() => alert('Supprimer non implémenté')}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
    </div>
  );
}
