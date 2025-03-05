// hooks/useCharactersData.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Character, Class, Server, Race } from '../types';
import { getAuthToken } from '@/app/services/Auth';

export function useCharactersData() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Charger les données de référence (classes, serveurs, races)
    const fetchReferenceData = async () => {
      try {
        const [classesResponse, serversResponse, racesResponse] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/servers'),
          fetch('/api/races')
        ]);

        if (!classesResponse.ok || !serversResponse.ok || !racesResponse.ok) {
          throw new Error('Erreur lors du chargement des données de référence');
        }

        const classesData = await classesResponse.json();
        const serversData = await serversResponse.json();
        const racesData = await racesResponse.json();

        setClasses(classesData);
        setServers(serversData);
        setRaces(racesData);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les données de référence');
      }
    };

    // Charger les personnages
    const fetchCharacters = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/auth');
          return;
        }

        const response = await fetch('/api/characters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des personnages');
        }

        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger vos personnages');
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
    fetchCharacters();
  }, [router]);

  // Fonctions utilitaires
  const getClassColor = (classId: number) => {
    const characterClass = classes.find(c => c.id === classId);
    return characterClass?.colorCode || '#cccccc';
  };

  const getClassName = (classId: number) => {
    const characterClass = classes.find(c => c.id === classId);
    return characterClass?.name || 'Classe inconnue';
  };

  const getServerName = (serverId: number) => {
    const server = servers.find(s => s.id === serverId);
    return server?.name || 'Serveur inconnu';
  };

  const getRaceName = (raceId: number) => {
    const race = races.find(r => r.id === raceId);
    return race?.name || 'Race inconnue';
  };

  const getFactionColor = (raceId: number) => {
    const race = races.find(r => r.id === raceId);
    return race?.faction?.colorCode || '#cccccc';
  };

  const getFactionName = (raceId: number) => {
    const race = races.find(r => r.id === raceId);
    return race?.faction?.name || 'Faction inconnue';
  };

  return {
    characters,
    setCharacters,
    classes,
    servers,
    races,
    loading,
    error,
    utils: {
      getClassColor,
      getClassName,
      getServerName,
      getRaceName,
      getFactionColor,
      getFactionName
    }
  };
}