'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { EcheancierTableauPDF } from './echeancier-tableau-pdf';
import { Download, X } from 'lucide-react';

interface EcheancierTableauDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projet: any;
  parametres?: { rbq?: string; siteWeb?: string };
  variant: 'client' | 'soustraitant';
}

// Aperçu + téléchargement du nouvel échéancier TABLEAU, rendu 100 % client-side
// (PDFViewer + PDFDownloadLink), comme le download Gantt. Aucune route serveur.
export function EcheancierTableauDialog({ open, onOpenChange, projet, parametres, variant }: EcheancierTableauDialogProps) {
  const [isClient] = useState(typeof window !== 'undefined');
  if (!isClient || !open) return null;

  const avecFournisseur = variant === 'soustraitant';
  const variantLabel = avecFournisseur ? 'sous-traitant' : 'client';
  const fileName = `echeancier-${variantLabel}-${projet.adresse.replace(/\s+/g, '-')}-${new Date().toLocaleDateString('fr-CA').replace(/\//g, '-')}.pdf`;
  const doc = <EcheancierTableauPDF projet={projet} parametres={parametres} avecFournisseur={avecFournisseur} />;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !p-0 !flex !flex-col">
        <DialogHeader className="border-b px-4 py-3 flex-shrink-0">
          <DialogTitle>Échéancier ({variantLabel}) — {projet.adresse}, {projet.ville}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-gray-100">
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            {doc}
          </PDFViewer>
        </div>

        <div className="border-t px-4 py-3 flex-shrink-0 flex gap-2 justify-end bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>
          <PDFDownloadLink document={doc} fileName={fileName}>
            {({ loading }) => (
              <Button disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700">
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
