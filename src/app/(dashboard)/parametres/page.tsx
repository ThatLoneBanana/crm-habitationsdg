import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, FileText } from 'lucide-react';

export default function ParametresPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez les paramètres de l'application</p>
      </div>

      <div className="grid gap-4">
        <Link href="/parametres/templates">
          <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">Templates de cédule</p>
              <p className="text-sm text-gray-600">Gérez les templates d'étapes pour chaque type de projet</p>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}
