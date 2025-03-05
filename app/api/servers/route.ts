import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const servers = await prisma.server.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(servers);
  } catch (error) {
    console.error('Erreur lors de la récupération des serveurs :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des serveurs' },
      { status: 500 }
    );
  }
}