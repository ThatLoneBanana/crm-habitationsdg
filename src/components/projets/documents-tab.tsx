import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';

interface DocumentsTabProps {
  projectId: string;
}

export function DocumentsTab({ projectId }: DocumentsTabProps) {
  const documents = [
    // Exemple de documents - à connecter avec une vraie DB
    // { id: 1, name: 'Contrat préliminaire.pdf', uploadedAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      {/* Bouton upload */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4" />
          Télécharger un document
        </Button>
      </div>

      {/* Zone de drop */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">
          Glissez des fichiers ici
        </p>
        <p className="text-gray-500 text-sm">ou cliquez pour sélectionner</p>
      </div>

      {/* Liste des documents */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun document téléchargé</p>
          </div>
        ) : (
          documents.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString('fr-CA')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
