import { User } from './types';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

export async function createToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  return new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}