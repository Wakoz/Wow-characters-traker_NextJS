// types/index.ts

// Types d'authentification
export interface User {
    id: number;
    email: string;
  }
  
  export interface AuthCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  // Types principaux de l'application
  export interface Character {
    id: number;
    name: string;
    level: number;
    class_id: number;
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
  
  export interface NewCharacter {
    id?: number;
    name: string;
    level: number;
    class_id: number;
    server_id: number;
    race_id: number;
  }
  
  export interface CharacterApiData {
    id?: number;
    name: string;
    level: number;
    classId: number;
    serverId: number;
    raceId: number;
  }
  
  // Types de référence
  export interface Class {
    id: number;
    name: string;
    colorCode: string;
  }
  
  export interface Server {
    id: number;
    name: string;
    region: string;
  }
  
  export interface Race {
    id: number;
    name: string;
    factionId: number;
    faction: Faction;
  }
  
  export interface Faction {
    id: number;
    name: string;
    colorCode: string;
  }