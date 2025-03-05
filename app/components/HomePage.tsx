'use client';

import Link from 'next/link';
import { GamepadIcon, UsersIcon, ServerIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center">
        <h1 className="text-5xl font-bold text-yellow-500 mb-6">
          Bienvenue à toi jeune aventurier !
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Gérez et suivez facilement vos personnages World of Warcraft. 
          Organisez, cataloguez et gardez une trace de tous vos héros.
        </p>
        
        <Link 
          href="/auth" 
          className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg 
                     hover:bg-yellow-600 transition-colors text-lg 
                     inline-flex items-center space-x-2"
        >
          <UsersIcon className="mr-2" />
          Commencer
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <GamepadIcon className="mx-auto mb-4 text-yellow-500" size={48} />
            <h2 className="text-xl font-bold mb-3 text-yellow-500">
              Suivi de personnages
            </h2>
            <p className="text-gray-300">
              Suivez tous vos personnages avec facilité. Niveau, classe, serveur, tout est à portée de main.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <ServerIcon className="mx-auto mb-4 text-yellow-500" size={48} />
            <h2 className="text-xl font-bold mb-3 text-yellow-500">
              Multi-serveurs
            </h2>
            <p className="text-gray-300">
              Gérez vos personnages sur différents serveurs. Une vue centralisée de tous vos héros.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <UsersIcon className="mx-auto mb-4 text-yellow-500" size={48} />
            <h2 className="text-xl font-bold mb-3 text-yellow-500">
              Personnalisation
            </h2>
            <p className="text-gray-300">
              Ajoutez, modifiez et supprimez vos personnages en toute simplicité.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}