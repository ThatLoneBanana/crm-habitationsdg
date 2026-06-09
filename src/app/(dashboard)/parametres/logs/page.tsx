'use client';

import { useState, useEffect } from 'react';
import { ProtectedPage } from '@/components/auth/protected-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Log {
  id: string;
  projetId: string;
  userId: string | null;
  action: string;
  description: string;
  createdAt: Date;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    if (filters.userId) {
      filtered = filtered.filter(l => l.userId?.includes(filters.userId));
    }

    if (filters.action) {
      filtered = filtered.filter(l =>
        l.action.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        l => new Date(l.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        l => new Date(l.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredLogs(filtered);
  };

  const exportCSV = () => {
    const headers = ['Date/Heure', 'Utilisateur', 'Action', 'Entité', 'Description'];
    const rows = filteredLogs.map(log => [
      new Date(log.createdAt).toLocaleString('fr-CA'),
      log.userId || 'Système',
      log.action,
      log.projetId,
      log.description,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionColors: Record<string, string> = {
    CREE: 'bg-green-100 text-green-800',
    MODIFIE: 'bg-blue-100 text-blue-800',
    SUPPRIME: 'bg-red-100 text-red-800',
    INSP_CREEE: 'bg-purple-100 text-purple-800',
    INSP_MODIFIEE: 'bg-purple-100 text-purple-800',
    CHECKLIST_COCHA: 'bg-yellow-100 text-yellow-800',
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <ProtectedPage requiredRoles={['ADMIN', 'DEVELOPPEUR']}>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Journal des logs</h1>
          <Button
            onClick={exportCSV}
            variant="outline"
            className="gap-2"
            disabled={filteredLogs.length === 0}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <h3 className="font-semibold text-gray-900">Filtres</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Utilisateur ID</label>
              <Input
                placeholder="ID utilisateur..."
                value={filters.userId}
                onChange={(e) =>
                  setFilters({ ...filters, userId: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Action</label>
              <Input
                placeholder="Action..."
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Du</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Au</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Date/Heure</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Utilisateur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Action</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Entité</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucun log trouvé
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {new Date(log.createdAt).toLocaleString('fr-CA')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {log.userId || 'Système'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={actionColors[log.action] || 'bg-gray-100 text-gray-800'}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {log.projetId}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {log.description.substring(0, 50)}...
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setDetailsOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dialog détails */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du log</DialogTitle>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date/Heure</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedLog.createdAt).toLocaleString('fr-CA')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Utilisateur</label>
                  <p className="text-gray-900 mt-1 font-mono">
                    {selectedLog.userId || 'Système'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Action</label>
                  <p className="text-gray-900 mt-1">
                    <Badge className={actionColors[selectedLog.action] || 'bg-gray-100 text-gray-800'}>
                      {selectedLog.action}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entité (Projet ID)</label>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">
                    {selectedLog.projetId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {selectedLog.description}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedPage>
  );
}
