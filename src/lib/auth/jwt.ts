import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('トークンが無効です');
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
} 