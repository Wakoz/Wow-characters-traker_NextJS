'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '../services/Auth';

// Liste des routes qui nécessitent une authentification
const protectedRoutes = ['/characters'];
// Liste des routes accessibles uniquement aux utilisateurs non authentifiés
const authRoutes = ['/auth'];

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const authenticated = isAuthenticated();
    
    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (!authenticated && protectedRoutes.some(route => pathname?.startsWith(route))) {
      router.push('/auth');
    }
    
    // Si l'utilisateur est authentifié et essaie d'accéder à une route d'authentification
    if (authenticated && authRoutes.includes(pathname || '')) {
      router.push('/characters');
    }
    
    setLoading(false);
  }, [pathname, router]);

  // Afficher un écran de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  return <>{children}</>;
}