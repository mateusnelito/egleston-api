import { PrismaClient } from '@prisma/client';

// Set and export the prisma connection
export const prisma = new PrismaClient({ log: ['query'] });
