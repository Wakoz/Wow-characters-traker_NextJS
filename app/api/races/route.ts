import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const races = await prisma.race.findMany({
      include: {
        faction: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(races);
  } catch (error) {
    console.error('Erreur lors de la récupération des races :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des races' },
      { status: 500 }
    );
  }
}