'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';

interface PrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projetId: string;
  adresse: string;
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  projetId,
  adresse,
}: PrintPreviewDialogProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchHTML = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pdf/cedule?projetId=${projetId}`);
        if (!res.ok) throw new Error('Erreur lors de la génération du PDF');
        const data = await res.json();
        setHtml(data.html);
      } catch (err: any) {
        alert('Erreur: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHTML();
  }, [open, projetId]);

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.print();
    }
  };

  const handleDownload = () => {
    if (!html) return;
    const element = document.createElement('a');
    const file = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `cedule-${adresse.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Aperçu de la cédule — {adresse}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Génération du document...</p>
            </div>
          ) : (
            <iframe
              id="pdf-iframe"
              srcDoc={html}
              className="w-full h-full border-none"
              title="Aperçu PDF"
            />
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <Button onClick={handleDownload} className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            Télécharger HTML
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
