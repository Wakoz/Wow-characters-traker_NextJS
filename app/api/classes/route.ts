import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des classes' },
      { status: 500 }
    );
  }
}