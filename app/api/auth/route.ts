import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, createToken } from '../../lib/auth/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, isLogin } = await request.json();

    // Validation de base
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (isLogin) {
      // Connexion
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Identifiants invalides' },
          { status: 401 }
        );
      }

      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, error: 'Identifiants invalides' },
          { status: 401 }
        );
      }

      // Générer un token JWT avec notre fonction existante
      const token = await createToken(user);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } else {
      // Inscription
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }

      // Hasher le mot de passe avec notre fonction existante
      const hashedPassword = await hashPassword(password);

      // Créer le nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });

      // Générer un token JWT avec notre fonction existante
      const token = await createToken(newUser);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email
        }
      });
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors de l\'authentification' },
      { status: 500 }
    );
  }
}