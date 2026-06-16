import CarnetClient from '@/components/carnet/CarnetClient';

// Carnet d'adresses — entrée « Fournisseurs » (écran combiné REF, onglet Fournisseurs par défaut).
export default function FournisseursPage() {
  return <CarnetClient defaultData="fournisseurs" />;
}
