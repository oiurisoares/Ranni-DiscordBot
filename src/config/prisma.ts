import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect()
    .then(() => console.info('Database initialised'))
    .catch(console.error);

export default prisma;
