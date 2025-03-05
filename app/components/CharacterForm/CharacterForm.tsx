// components/CharacterForm/CharacterForm.tsx
import { useState, useEffect } from 'react';
import { getAuthToken } from '../../services/Auth';
import { Class, Server, Race, NewCharacter } from '../../types';
import { InputField, SelectField } from '../form';
import { adaptCharacterToApi } from '../../utils/dataAdapters';

interface CharacterFormProps {
  onClose: () => void;
  onSuccess: () => void;
  character?: NewCharacter;
  classes: Class[];
  servers: Server[];
  races: Race[];
}

export default function CharacterForm({ 
  onClose, 
  onSuccess, 
  character, 
  classes, 
  servers, 
  races 
}: CharacterFormProps) {
  const [formData, setFormData] = useState<NewCharacter>({
    name: '',
    level: 1,
    class_id: 0,
    server_id: 0,
    race_id: 0,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<number | null>(null);

  // Filtrer les races en fonction de la faction sélectionnée
  const filteredRaces = selectedFaction 
    ? races.filter(race => race.factionId === selectedFaction)
    : races;

  // Initialiser le formulaire si un personnage est fourni pour édition
  useEffect(() => {
    if (character) {
      setFormData({
        id: character.id,
        name: character.name,
        level: character.level,
        class_id: character.class_id,
        server_id: character.server_id,
        race_id: character.race_id,
      });
      
      // Si un personnage est fourni, définir la faction en fonction de sa race
      const race = races.find(r => r.id === character.race_id);
      if (race) {
        setSelectedFaction(race.factionId);
      }
    }
  }, [character, races]);

  // Gestionnaire pour mettre à jour l'état du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Gérer spécifiquement le champ de niveau
    if (name === 'level') {
      if (value === '') {
        setFormData({...formData, level: 0});
      } else {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 80) {
          setFormData({...formData, level: numValue});
        }
      }
    } else {
      // Pour tous les autres champs
      setFormData({
        ...formData,
        [name]: name === 'name' ? value : parseInt(value)
      });
    }
  };

  // Gestionnaire pour le changement de faction
  const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const factionId = parseInt(e.target.value);
    setSelectedFaction(factionId);
    
    // Réinitialiser la race sélectionnée lors du changement de faction
    setFormData({
      ...formData,
      race_id: 0
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les données du formulaire
    if (!formData.name || 
        formData.level === 0 || 
        !formData.class_id || formData.class_id === 0 ||
        !formData.server_id || formData.server_id === 0 ||
        !formData.race_id || formData.race_id === 0) {
      
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      const url = formData.id ? `/api/characters/${formData.id}` : '/api/characters';
      const method = formData.id ? 'PUT' : 'POST';
      
      // Adapter les données pour l'API
      const apiFormData = adaptCharacterToApi(formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiFormData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement du personnage');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">
        {character ? 'Modifier le personnage' : 'Ajouter un personnage'}
      </h2>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="Nom du personnage"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <InputField
          label="Niveau"
          name="level"
          type="number"
          min={1}
          max={80}
          value={formData.level === 0 ? "" : formData.level}
          onChange={handleChange}
          required
        />

        <SelectField
          label="Faction"
          value={selectedFaction || ''}
          onChange={handleFactionChange}
          options={[
            { id: 1, name: 'Alliance' },
            { id: 2, name: 'Horde' }
          ]}
          required
        />
        
        <SelectField
          label="Race"
          name="race_id"
          value={formData.race_id}
          onChange={handleChange}
          options={filteredRaces}
          disabled={!selectedFaction}
          required
          placeholder="Sélectionnez une race"
        />
        
        <SelectField
          label="Classe"
          name="class_id"
          value={formData.class_id}
          onChange={handleChange}
          options={classes}
          required
          placeholder="Sélectionnez une classe"
        />
        
        <SelectField
          label="Serveur"
          name="server_id"
          value={formData.server_id}
          onChange={handleChange}
          options={servers}
          required
          placeholder="Sélectionnez un serveur"
        />
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (character ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </form>
    </div>
  );
}