'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Phone } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Erreur chargement clients');
        const data = await res.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Liste de tous les clients ({clients.length})</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouveau client
        </Button>
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <div key={client.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {client.prenom} {client.nom}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                  {client.telephone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {client.telephone}
                    </div>
                  )}
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {client.projets?.length || 0} projet{(client.projets?.length || 0) !== 1 ? 's' : ''}
              </Badge>
            </div>

            {client.projets && client.projets.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Projets associés:</p>
                <div className="space-y-2">
                  {client.projets.map((projet: any) => (
                    <Link
                      key={projet.id}
                      href={`/projets/${projet.slug}`}
                      className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition text-sm text-blue-600 hover:underline"
                    >
                      📍 {projet.adresse}, {projet.ville}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
