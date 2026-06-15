'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedPage({
  children,
  requiredRoles = [],
  fallback,
}: ProtectedPageProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const { user } = await res.json();
        setUserRole(user?.role || null);

        const hasRequiredRole =
          requiredRoles.length === 0 ||
          requiredRoles.includes(user?.role);

        if (!hasRequiredRole) {
          setIsAuthorized(false);
          if (fallback) {
            setIsLoading(false);
            return;
          }
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRoles, fallback]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Accès refusé</h2>
            <p className="text-gray-600">Vous n'avez pas la permission d'accéder à cette page.</p>
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retour
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
