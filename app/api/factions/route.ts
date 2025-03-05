import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const factions = await prisma.faction.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(factions);
  } catch (error) {
    console.error('Erreur lors de la récupération des factions :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factions' },
      { status: 500 }
    );
  }
}