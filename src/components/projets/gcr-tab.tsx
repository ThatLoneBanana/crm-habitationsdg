'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';

interface GCRTabProps {
  projectId: string;
}

const DEFAULT_CHECKLIST_ITEMS = [
  'Formulaire SR complété et signé',
  'Documents soumis à l\'autorité locale',
  'Inspection initiale effectuée',
  'Plan conforme approuvé',
];

const DEFAULT_INSPECTIONS = [
  { titre: 'Inspection charpente et structure', statut: 'PLANIFIEE' },
  { titre: 'Inspection électricité et plomberie', statut: 'PLANIFIEE' },
  { titre: 'Inspection finitions et peinture', statut: 'PLANIFIEE' },
];

export function GCRTab({ projectId }: GCRTabProps) {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<any>(null);
  const [newInspection, setNewInspection] = useState({ titre: '', datePlanifiee: '' });
  const [checklistNotes, setChecklistNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/projets/${projectId}/gcr`);
      if (res.ok) {
        const data = await res.json();
        setChecklists(data.checklists || []);
        setInspections(data.inspections || []);
        setLogs(data.logs || []);

        if (data.checklists.length === 0) {
          initializeChecklists();
        }
        if (data.inspections.length === 0) {
          initializeInspections();
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeChecklists = async () => {
    try {
      const newItems = DEFAULT_CHECKLIST_ITEMS.map((label, idx) => ({
        projetId: projectId,
        label,
        estCocha: false,
        dateCocha: null,
        notes: '',
        id: `temp-${idx}`,
      }));

      for (const item of newItems) {
        const res = await fetch(`/api/projets/${projectId}/gcr/checklists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: item.label,
            estCocha: false,
            notes: '',
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setChecklists(prev => [...prev.filter(c => c.id !== item.id), created]);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const initializeInspections = async () => {
    try {
      for (const insp of DEFAULT_INSPECTIONS) {
        const res = await fetch(`/api/projets/${projectId}/gcr/inspections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: insp.titre,
            datePlanifiee: null,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setInspections(prev => [...prev, created]);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChecklistChange = async (id: string, field: string, value: any) => {
    const updated = checklists.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setChecklists(updated);

    if (field === 'estCocha') {
      try {
        await fetch(`/api/projets/${projectId}/gcr`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checklists: updated }),
        });

        if (value) {
          await fetch(`/api/projets/${projectId}/gcr/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'CHECKLIST_COCHA',
              description: `Item coché: ${checklists.find(c => c.id === id)?.label}`,
            }),
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleInspectionSubmit = async () => {
    if (!newInspection.titre) return;

    try {
      if (editingInspection) {
        const res = await fetch(`/api/projets/${projectId}/gcr/inspections`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inspectionId: editingInspection.id,
            statut: editingInspection.statut,
            dateRealisee: editingInspection.dateRealisee,
            notes: editingInspection.notes,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setInspections(inspections.map(i => i.id === updated.id ? updated : i));
        }
      } else {
        const res = await fetch(`/api/projets/${projectId}/gcr/inspections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: newInspection.titre,
            datePlanifiee: newInspection.datePlanifiee || null,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setInspections([...inspections, created]);
        }
      }

      setInspectionDialogOpen(false);
      setNewInspection({ titre: '', datePlanifiee: '' });
      setEditingInspection(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const statusBadgeColors: Record<string, string> = {
    PLANIFIEE: 'bg-yellow-100 text-yellow-800',
    COMPLETEE: 'bg-green-100 text-green-800',
    NON_CONFORME: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    PLANIFIEE: 'Planifiée',
    COMPLETEE: 'Complétée',
    NON_CONFORME: 'Non-conforme',
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Section Checklist SR */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Checklist administrative SR</h3>
        <div className="space-y-3 bg-white p-4 rounded-lg border">
          {checklists.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-3 border rounded hover:bg-gray-50">
              <Checkbox
                checked={item.estCocha}
                onCheckedChange={(checked) =>
                  handleChecklistChange(item.id, 'estCocha', checked)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium cursor-pointer">
                  {item.label}
                </label>
                {item.estCocha && item.dateCocha && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coché le {formatDate(item.dateCocha)}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Notes..."
                  value={item.notes || ''}
                  onChange={(e) =>
                    handleChecklistChange(item.id, 'notes', e.target.value)
                  }
                  onBlur={() => {
                    fetch(`/api/projets/${projectId}/gcr`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ checklists }),
                    });
                  }}
                  className="text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Inspections GCR */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Inspections GCR</h3>
          <Button
            size="sm"
            onClick={() => {
              setNewInspection({ titre: '', datePlanifiee: '' });
              setEditingInspection(null);
              setInspectionDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3 bg-white p-4 rounded-lg border">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="flex items-start justify-between p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{insp.titre}</span>
                  <Badge className={statusBadgeColors[insp.statut]}>
                    {statusLabels[insp.statut]}
                  </Badge>
                </div>
                {insp.datePlanifiee && (
                  <p className="text-xs text-gray-500">
                    Planifiée: {formatDate(insp.datePlanifiee)}
                  </p>
                )}
                {insp.dateRealisee && (
                  <p className="text-xs text-gray-500">
                    Réalisée: {formatDate(insp.dateRealisee)}
                  </p>
                )}
                {insp.notes && (
                  <p className="text-xs text-gray-600 mt-2 italic">{insp.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingInspection(insp);
                    setInspectionDialogOpen(true);
                  }}
                  className="gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Journal GCR */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Journal GCR</h3>
        <div className="bg-white p-4 rounded-lg border space-y-2 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">Aucune entrée</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="text-xs p-2 border-b last:border-0">
                <div className="flex justify-between">
                  <span className="font-mono text-gray-500">
                    {formatDate(log.createdAt)}
                  </span>
                  <span className="font-semibold">{log.action}</span>
                </div>
                <p className="text-gray-700 mt-1">{log.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog Inspection */}
      <Dialog open={inspectionDialogOpen} onOpenChange={setInspectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingInspection ? 'Modifier inspection' : 'Nouvelle inspection'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {editingInspection ? (
              <>
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={editingInspection.statut}
                    onValueChange={(value) =>
                      setEditingInspection({ ...editingInspection, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANIFIEE">Planifiée</SelectItem>
                      <SelectItem value="COMPLETEE">Complétée</SelectItem>
                      <SelectItem value="NON_CONFORME">Non-conforme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Date réalisée</label>
                  <Input
                    type="date"
                    value={
                      editingInspection.dateRealisee
                        ? editingInspection.dateRealisee.split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditingInspection({
                        ...editingInspection,
                        dateRealisee: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={editingInspection.notes || ''}
                    onChange={(e) =>
                      setEditingInspection({
                        ...editingInspection,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Notes d'inspection..."
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={newInspection.titre}
                    onChange={(e) =>
                      setNewInspection({ ...newInspection, titre: e.target.value })
                    }
                    placeholder="Ex: Inspection électricité..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Date planifiée</label>
                  <Input
                    type="date"
                    value={newInspection.datePlanifiee}
                    onChange={(e) =>
                      setNewInspection({
                        ...newInspection,
                        datePlanifiee: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setInspectionDialogOpen(false);
                setEditingInspection(null);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleInspectionSubmit} className="gap-2">
              <Check className="w-4 h-4" />
              {editingInspection ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
