'use client';
import { useState } from 'react';
import { useCharactersData } from '../hooks/useCharactersData';
import CharacterForm from '../components/CharacterForm/CharacterForm';
import CharacterCard from '../components/CharacterCard/CharacterCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Character } from '../types';

export default function CharactersPage() {
  const { 
    characters, 
    setCharacters, 
    classes, 
    servers, 
    races, 
    loading, 
    error,
    utils
  } = useCharactersData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  // Ouvrir le formulaire de création
  const handleOpenForm = () => {
    setSelectedCharacter(null);
    setIsFormOpen(true);
  };

  // Ouvrir le formulaire de modification
  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsFormOpen(true);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCharacter(null);
  };

  // Préparer la suppression d'un personnage
  const handlePrepareDeleteCharacter = (character: Character) => {
    setCharacterToDelete(character);
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setCharacterToDelete(null);
  };

  // Gérer la suppression d'un personnage
  const handleDeleteCharacter = async () => {
    if (!characterToDelete) return;

    try {
      // Appeler l'API pour supprimer le personnage
      // ...
      
      // Mettre à jour la liste des personnages
      setCharacters(prevCharacters => 
        prevCharacters.filter(char => char.id !== characterToDelete.id)
      );

      // Fermer le modal de confirmation
      setCharacterToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  // Après ajout/modification réussie
  const handleSuccessSubmit = async () => {
    // Recharger la liste des personnages
    // ...
    handleCloseForm();
  };

  // Afficher un écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-yellow-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Chargement des personnages...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-red-900 p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">Une erreur est survenue</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-500 mb-6">Mes personnages</h1>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded"
            onClick={handleOpenForm}
          >
            Ajouter un personnage
          </button>
        </div>
  
        {/* Ajout du formulaire modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <CharacterForm 
              onClose={handleCloseForm}
              onSuccess={handleSuccessSubmit}
              character={selectedCharacter || undefined}
              classes={classes}
              servers={servers}
              races={races}
            />
          </div>
        )}
  
        {/* Modal de confirmation de suppression */}
        {characterToDelete && (
          <DeleteConfirmationModal 
            characterName={characterToDelete.name}
            onConfirm={handleDeleteCharacter}
            onCancel={handleCancelDelete}
          />
        )}
  
        {characters.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-yellow-600">
            <p className="text-lg mb-4">Vous n'avez pas encore de personnages.</p>
            <p className="text-yellow-400">Cliquez sur le bouton "Ajouter un personnage" pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(char => (
              <CharacterCard
                key={char.id}
                character={char}
                onEdit={handleEditCharacter}
                onDelete={handlePrepareDeleteCharacter}
                getClassColor={utils.getClassColor}
                getFactionColor={utils.getFactionColor}
                getFactionName={utils.getFactionName}
                getClassName={utils.getClassName}
                getRaceName={utils.getRaceName}
                getServerName={utils.getServerName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}