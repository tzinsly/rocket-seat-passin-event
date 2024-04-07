import { PrismaClient } from '@prisma/client'; //Importing one of the classes

export const prisma = new PrismaClient({
    log: ['query']
})