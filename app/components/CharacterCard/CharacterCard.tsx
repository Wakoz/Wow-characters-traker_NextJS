// components/CharacterCard/CharacterCard.tsx
import { Character } from '../../types';

interface CharacterCardProps {
  character: Character;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
  getClassColor: (classId: number) => string;
  getFactionColor: (raceId: number) => string;
  getFactionName: (raceId: number) => string;
  getClassName: (classId: number) => string;
  getRaceName: (raceId: number) => string;
  getServerName: (serverId: number) => string;
}

export default function CharacterCard({
  character,
  onEdit,
  onDelete,
  getClassColor,
  getFactionColor,
  getFactionName,
  getClassName,
  getRaceName,
  getServerName
}: CharacterCardProps) {
  const factionColor = character.faction_color || getFactionColor(character.race_id);
  const factionName = character.faction_name || getFactionName(character.race_id);
  const factionBgClass = factionName === 'Alliance' ? 'bg-blue-900' : 'bg-red-900';
  
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700"
      style={{
        borderColor: getClassColor(character.class_id)
      }}
    >
      {/* En-tête avec faction */}
      <div className={`px-3 py-1 ${factionBgClass} bg-opacity-50 flex justify-end items-center`}>
        <span className="text-xs font-bold" style={{ color: factionColor }}>
          Faction: {factionName}
        </span>
      </div>
      
      {/* Information du personnage */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-2">
          <h2 
            className="text-xl font-bold" 
            style={{ color: getClassColor(character.class_id) }}
          >
            {character.name}
          </h2>
          <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
            Niveau <span className="text-yellow-400">{character.level}</span>
          </span>
        </div>
        
        {/* Infos du personnage */}
        <div className="text-gray-300 text-sm mt-4 space-y-1">
          <p className="flex items-center">
            <span className="w-4 h-4 mr-2 inline-block rounded-full" 
                  style={{ backgroundColor: getClassColor(character.class_id) }}></span>
            Classe: {character.class_name || getClassName(character.class_id)}
          </p>
          <p className="flex items-center">
            <span className="w-4 h-4 mr-2 inline-block rounded-full" 
                  style={{ backgroundColor: factionColor }}></span>
            Race: {character.race_name || getRaceName(character.race_id)}
          </p>
          <p className="flex items-center">
            <span className="w-4 h-4 mr-2 inline-block rounded-full bg-gray-500"></span>
            Serveur: {character.server_name || getServerName(character.server_id)}
          </p>
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="h-px bg-gray-700"></div>
      
      {/* Boutons d'action */}
      <div className="px-6 py-3 bg-gray-900 flex justify-center space-x-4">
        <button 
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          onClick={() => onEdit(character)}
        >
          Modifier
        </button>
        <button 
          className="text-red-400 hover:text-red-300 transition-colors duration-200"
          onClick={() => onDelete(character)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}