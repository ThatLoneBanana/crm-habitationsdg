'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const [projetsCount, setProjetsCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/metriques');
        const data = await res.json();
        setProjetsCount(data.projetsActifs || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex flex-col h-full">
      {/* Logo SVG centré - seul élément en haut */}
      <div className="flex justify-center pt-6 pb-5">
        <Link href="/">
          <Image
            src="/habitationsdg.svg"
            alt="Habitations DG"
            width={160}
            height={80}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Navigation links */}
      <div className="space-y-1 px-2">
        <Link href="/" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm">
          Dashboard
        </Link>
        <Link href="/projets" className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-sm">
          <span>Projets</span>
          {projetsCount > 0 && (
            <Badge className="bg-blue-100 text-blue-800 font-bold text-xs">
              {projetsCount}
            </Badge>
          )}
        </Link>
        <Link href="/clients" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm">
          Clients
        </Link>
        <Link href="/fournisseurs" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm">
          Fournisseurs
        </Link>
        <Link href="/parametres" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm">
          Paramètres
        </Link>
      </div>
    </nav>
  );
}
