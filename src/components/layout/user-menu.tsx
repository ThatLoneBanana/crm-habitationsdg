'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  user?: {
    prenom: string;
    nom: string;
    email: string;
    role: string;
  } | null;
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrateur',
  COMPTABILITE: 'Comptabilité',
  VENDEUR: 'Vendeur',
  CHARGE_PROJET: 'Chargé de projet',
  DEVELOPPEUR: 'Développeur',
};

export function UserMenu({ user }: UserMenuProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-4 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-700 font-semibold text-sm">
            {user.prenom[0]}
            {user.nom[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.prenom} {user.nom}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {roleLabels[user.role] || user.role}
          </p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        disabled={loading}
        variant="ghost"
        size="sm"
        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {loading ? 'Déconnexion...' : 'Déconnexion'}
      </Button>
    </div>
  );
}
