'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from '@/lib/auth';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion avec:', { email, password: '***' });
      const result = await signInWithEmail(email, password);
      console.log('✅ Connexion réussie', result);

      // Attendre un peu pour que les cookies soient bien sauvegardés
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('📍 Redirection vers /', { cookies: document.cookie });
      router.push('/');

      // Fallback si le router.push ne fonctionne pas
      setTimeout(() => {
        console.log('⚠️  Fallback: rechargement de la page');
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      console.error('❌ Erreur de connexion:', err);
      const errorMsg = err.message || err.error_description || 'Erreur lors de la connexion. Vérifiez vos identifiants.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Habitations DG</h1>
          <p className="text-gray-600 text-sm mt-1">Gestion de projets</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={loading}
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {/* Bouton */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        {/* Aide */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Pour l'assistance, contactez votre administrateur</p>
        </div>
      </div>
    </div>
  );
}
