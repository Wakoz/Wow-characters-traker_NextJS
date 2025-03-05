'use client';

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from 'lucide-react';
import { getAuthToken, removeAuthToken, isAuthenticated } from "../services/Auth";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérification de l'authentification côté client
    const checkAuthentication = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
    };

    checkAuthentication();
  }, [pathname]);

  const handleLogout = () => {
    // Supprimer le token d'authentification
    removeAuthToken();
    
    // Rediriger vers la page de connexion
    router.push('/auth');
  };

  // Fonction pour gérer la navigation sécurisée
  const handleNavigation = (href: string) => {
    // Si l'utilisateur est sur /characters et clique sur Accueil, aller à la page d'accueil
    if (href === '/') {
      router.push('/');
      return;
    }

    // Pour les autres routes, vérifier l'authentification
    if (isAuthenticated()) {
      // Si connecté, permettre la navigation normale
      router.push(href);
    } else {
      // Si non connecté, rediriger vers l'auth
      router.push('/auth');
    }
  };

  return (
    <header className="bg-gray-800 p-4 shadow-lg text-center relative">
      <h1 className="text-4xl font-bold text-yellow-500">
        Wow Characters Tracker
      </h1>
      <nav className="mt-4 flex justify-center items-center space-x-4">
        <button 
          onClick={() => handleNavigation('/')} 
          className={`text-yellow-500 hover:text-yellow-600 ${pathname === '/' ? 'font-bold' : ''}`}
        >
          Accueil
        </button>
        <button 
          onClick={() => handleNavigation('/characters')} 
          className={`text-yellow-500 hover:text-yellow-600 ${pathname === '/characters' ? 'font-bold' : ''}`}
        >
          Personnages
        </button>
        
        {/* Bouton de déconnexion - visible uniquement si authentifié */}
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 flex items-center space-x-2 ml-4"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;