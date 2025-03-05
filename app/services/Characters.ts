import { ENDPOINTS } from "./Config";
import { getAuthToken } from "./Auth";

export interface Character {
  id: number;
  name: string;
  class_id: number;
  level: number;
  server_id: number;
  race_id: number;
  user_id: number;
  class_name?: string;
  server_name?: string;
  race_name?: string;
  faction_id?: number;
  faction_name?: string;
  faction_color?: string;
}

export async function getAllCharacters() {
  const token = getAuthToken();
  const response = await fetch(ENDPOINTS.CHARACTERS.BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch characters");

  return response.json() as Promise<Character[]>;
}

export async function getCharacterById(id: number) {
  const token = getAuthToken();
  const response = await fetch(`${ENDPOINTS.CHARACTERS.BY_ID(id)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Impossible de récupérer le personnage");

  if (response.status === 204) {
    console.log("Mise à jour réussie, aucune donnée retournée.");
    return null;
  }

  return response.json();
}

export async function createCharacter(
  characterData: Omit<Character, "id" | "class_name" | "server_name" | "race_name" | "faction_id" | "faction_name" | "faction_color">,
) {
  const token = getAuthToken();
  const response = await fetch(ENDPOINTS.CHARACTERS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(characterData),
  });

  if (!response.ok) throw new Error("Failed to create character");

  return response.json();
}

export async function updateCharacter(character: Character) {
  const token = getAuthToken();
  const response = await fetch(`${ENDPOINTS.CHARACTERS.BASE}/${character.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(character),
  });
  if (!response.ok)
    throw new Error("Impossible de mettre à jour le personnage");

  if (response.status === 204) {
    console.log("Mise à jour réussie, aucune donnée retournée.");
    return null;
  }

  return response.json();
}

export async function deleteCharacter(id: number) {
  const token = getAuthToken();
  const response = await fetch(`${ENDPOINTS.CHARACTERS.BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Impossible de supprimer le personnage");

  if (response.status === 204) {
    console.log("Mise à jour réussie, aucune donnée retournée.");
    return null;
  }

  return response.json();
}