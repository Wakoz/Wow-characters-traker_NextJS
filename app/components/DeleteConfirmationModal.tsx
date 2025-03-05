import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  characterName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  characterName, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-red-900/30">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <Trash2 className="text-red-500 w-8 h-8" />
            <h2 className="text-center text-xl font-bold text-white">
              Supprimer le personnage
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Êtes-vous sûr de vouloir supprimer le personnage 
          <span className="font-bold text-red-400 mx-1">{characterName}</span> ? 
          Cette action est irréversible.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;