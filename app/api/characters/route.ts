import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'wow-tracker-secret-key';

// Fonction pour vérifier le token et récupérer l'ID utilisateur
function getUserIdFromToken(authHeader: string | null): number | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET - Récupérer tous les personnages de l'utilisateur connecté
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const characters = await prisma.character.findMany({
      where: {
        userId: userId
      },
      include: {
        class: true,
        server: true,
        race: {
          include: {
            faction: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transformer les données pour correspondre à l'interface
    const formattedCharacters = characters.map(char => ({
      id: char.id,
      name: char.name,
      level: char.level,
      user_id: char.userId,
      class_id: char.classId,
      server_id: char.serverId,
      race_id: char.raceId,
      class_name: char.class.name,
      server_name: char.server.name,
      race_name: char.race.name,
      faction_id: char.race.factionId,
      faction_name: char.race.faction.name,
      faction_color: char.race.faction.colorCode
    }));

    return NextResponse.json(formattedCharacters);
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des personnages' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau personnage
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Lire le corps de la requête UNE SEULE FOIS
    const requestData = await request.json();
    console.log("Données reçues:", requestData);

    const { name, level, classId, serverId, raceId } = requestData;

    // Conversion explicite en nombres
    const parsedServerId = Number(serverId);
    const parsedClassId = Number(classId);
    const parsedRaceId = Number(raceId);
    const parsedLevel = Number(level);

    // Validation des données
    if (!name || isNaN(parsedLevel) || isNaN(parsedClassId) || isNaN(parsedServerId) || isNaN(parsedRaceId)) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires et doivent être valides' },
        { status: 400 }
      );
    }

    // Vérifier si un personnage avec le même nom existe déjà sur ce serveur
    const existingCharacter = await prisma.character.findFirst({
      where: {
        name,
        serverId: parsedServerId
      }
    });

    if (existingCharacter) {
      return NextResponse.json(
        { error: 'Un personnage avec ce nom existe déjà sur ce serveur' },
        { status: 400 }
      );
    }

    // Créer le personnage
    const newCharacter = await prisma.character.create({
      data: {
        name,
        level: parsedLevel,
        classId: parsedClassId,
        serverId: parsedServerId,
        raceId: parsedRaceId,
        userId
      },
      include: {
        class: true,
        server: true,
        race: {
          include: {
            faction: true
          }
        }
      }
    });

    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du personnage :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du personnage' },
      { status: 500 }
    );
  }
}