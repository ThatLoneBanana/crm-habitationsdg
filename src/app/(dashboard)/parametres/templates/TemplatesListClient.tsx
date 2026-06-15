'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Plus } from 'lucide-react';

interface Template {
  id: string;
  nom: string;
  type: 'JUMELE' | 'MAISON' | 'MULTILOGEMENT';
  actif: boolean;
  etapes: { id: string; nom: string }[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) throw new Error('Erreur chargement templates');
        const data = await res.json();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates de cédule</h1>
          <p className="text-gray-600 mt-2">Gérez les templates d'étapes pour chaque type de projet</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouveau template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            Aucun template créé. Les templates par défaut seront créés automatiquement.
          </div>
        ) : (
          templates.map(template => (
            <div key={template.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{template.nom}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {template.type === 'JUMELE' ? 'Jumelé' : template.type === 'MAISON' ? 'Maison' : 'Multilogement'}
                    </Badge>
                    <span className="text-sm text-gray-600">{template.etapes.length} étapes</span>
                    <span className={`text-sm ${template.actif ? 'text-green-600' : 'text-gray-500'}`}>
                      {template.actif ? '✓ Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <Link href={`/parametres/templates/${template.id}`}>
                  <Button variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
