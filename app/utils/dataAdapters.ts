// utils/dataAdapters.ts
import { Character, NewCharacter, CharacterApiData } from '../types';

/**
 * Adapte les données d'un caractère du format frontend au format API
 */
export function adaptCharacterToApi(character: NewCharacter): CharacterApiData {
  return {
    id: character.id,
    name: character.name,
    level: typeof character.level === 'string' ? parseInt(character.level) || 1 : character.level,
    classId: typeof character.class_id === 'string' ? parseInt(character.class_id) : character.class_id,
    serverId: typeof character.server_id === 'string' ? parseInt(character.server_id) : character.server_id,
    raceId: typeof character.race_id === 'string' ? parseInt(character.race_id) : character.race_id
  };
}

/**
 * Adapte les données d'un caractère du format API au format frontend
 */
export function adaptCharacterFromApi(apiCharacter: any): Character {
  return {
    id: apiCharacter.id,
    name: apiCharacter.name,
    level: apiCharacter.level,
    class_id: apiCharacter.classId,
    server_id: apiCharacter.serverId,
    race_id: apiCharacter.raceId,
    user_id: apiCharacter.userId,
    class_name: apiCharacter.class?.name,
    server_name: apiCharacter.server?.name,
    race_name: apiCharacter.race?.name,
    faction_id: apiCharacter.race?.faction?.id,
    faction_name: apiCharacter.race?.faction?.name,
    faction_color: apiCharacter.race?.faction?.colorCode
  };
}