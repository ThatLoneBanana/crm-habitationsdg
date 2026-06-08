'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface ProjetsFiltersProps {
  onSearch: (search: string) => void;
  onPhaseChange: (phase: string) => void;
  defaultPhase?: string;
  defaultSearch?: string;
}

const phases = [
  { value: 'TOUS', label: 'Tous les projets' },
  { value: 'VENTE', label: 'Vente' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PREPARATION', label: 'Préparation' },
  { value: 'CHANTIER', label: 'Chantier' },
  { value: 'LIVRAISON', label: 'Livraison' },
  { value: 'CLOTURE', label: 'Clôturé' },
];

export function ProjetsFilters({
  onSearch,
  onPhaseChange,
  defaultPhase = 'TOUS',
  defaultSearch = '',
}: ProjetsFiltersProps) {
  const [search, setSearch] = useState(defaultSearch);
  const [phase, setPhase] = useState(defaultPhase);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  const handlePhase = (newPhase: string) => {
    setPhase(newPhase);
    onPhaseChange(newPhase);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Barre de recherche */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par client, adresse, numéro..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/projets/nouveau">
          <Button style={{ background: '#ea1c24' }} className="gap-2 hover:opacity-90" onMouseEnter={e => e.currentTarget.style.background = '#d41a1f'} onMouseLeave={e => e.currentTarget.style.background = '#ea1c24'}>
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* Filtres par phase */}
      <div className="flex gap-2 flex-wrap">
        {phases.map((p) => (
          <Button
            key={p.value}
            variant={phase === p.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePhase(p.value)}
            style={phase === p.value ? { background: '#ea1c24', color: 'white' } : {}}
            className={phase === p.value ? '' : 'text-gray-700'}
            onMouseEnter={e => phase === p.value && (e.currentTarget.style.background = '#d41a1f')}
            onMouseLeave={e => phase === p.value && (e.currentTarget.style.background = '#ea1c24')}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
