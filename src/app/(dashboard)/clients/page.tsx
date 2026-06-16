import CarnetClient from '@/components/carnet/CarnetClient';

// Carnet d'adresses — entrée « Clients » (écran combiné REF, onglet Clients par défaut).
export default function ClientsPage() {
  return <CarnetClient defaultData="clients" />;
}
