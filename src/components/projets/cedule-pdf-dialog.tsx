'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { CedulePDF } from './cedule-pdf';
import { Printer, Download, X, ExternalLink } from 'lucide-react';

interface CedulePDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projet: any;
  parametres?: { rbq?: string; siteWeb?: string };
}

export function CedulePDFDialog({
  open,
  onOpenChange,
  projet,
  parametres,
}: CedulePDFDialogProps) {
  const [isClient, setIsClient] = useState(typeof window !== 'undefined');

  if (!isClient || !open) return null;

  const fileName = `cedule-${projet.adresse.replace(/\s+/g, '-')}-${new Date().toLocaleDateString('fr-CA').replace(/\//g, '-')}`;

  const handleOpenFullScreen = () => {
    window.open(`/api/projets/${projet.id}/pdf`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !p-0 !flex !flex-col">
        <DialogHeader className="border-b px-4 py-3 flex-shrink-0">
          <DialogTitle>Aperçu de la cédule — {projet.adresse}, {projet.ville}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-gray-100">
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <CedulePDF projet={projet} parametres={parametres} />
          </PDFViewer>
        </div>

        <div className="border-t px-4 py-3 flex-shrink-0 flex gap-2 justify-end bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>

          <Button
            onClick={handleOpenFullScreen}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir en plein écran
          </Button>

          <PDFDownloadLink
            document={<CedulePDF projet={projet} parametres={parametres} />}
            fileName={`${fileName}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button
                disabled={loading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
