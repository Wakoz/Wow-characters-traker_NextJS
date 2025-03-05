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

// GET - Récupérer un personnage spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const characterId = Number(params.id);
    if (isNaN(characterId)) {
      return NextResponse.json(
        { error: 'ID de personnage invalide' },
        { status: 400 }
      );
    }

    const character = await prisma.character.findUnique({
      where: {
        id: characterId
      },
      include: {
        class: true,
        server: true
      }
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le personnage appartient bien à l'utilisateur connecté
    if (character.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Erreur lors de la récupération du personnage :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du personnage' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un personnage
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const characterId = Number(params.id);
    if (isNaN(characterId)) {
      return NextResponse.json(
        { error: 'ID de personnage invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le personnage existe et appartient bien à l'utilisateur
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: characterId
      }
    });

    if (!existingCharacter) {
      return NextResponse.json(
        { error: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    if (existingCharacter.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les données de mise à jour
    const { name, level, classId, serverId } = await request.json();

    // Validation des données
    if (!name || !level || !classId || !serverId) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si le nom est déjà pris (sauf si c'est le même personnage)
    if (name !== existingCharacter.name || serverId !== existingCharacter.serverId) {
      const nameExists = await prisma.character.findFirst({
        where: {
          name: name,
          serverId: Number(serverId),
          id: {
            not: characterId
          }
        }
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Un personnage avec ce nom existe déjà sur ce serveur' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le personnage
    const updatedCharacter = await prisma.character.update({
      where: {
        id: characterId
      },
      data: {
        name,
        level: Number(level),
        classId: Number(classId),
        serverId: Number(serverId)
      },
      include: {
        class: true,
        server: true
      }
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du personnage :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du personnage' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un personnage
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const characterId = Number(params.id);
    if (isNaN(characterId)) {
      return NextResponse.json(
        { error: 'ID de personnage invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le personnage existe et appartient bien à l'utilisateur
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: characterId
      }
    });

    if (!existingCharacter) {
      return NextResponse.json(
        { error: 'Personnage non trouvé' },
        { status: 404 }
      );
    }

    if (existingCharacter.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Supprimer le personnage
    await prisma.character.delete({
      where: {
        id: characterId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du personnage :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du personnage' },
      { status: 500 }
    );
  }
}