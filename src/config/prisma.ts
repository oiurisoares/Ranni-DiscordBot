import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

/**
 * Prisma client configuration.
 * This client is used to interact with the database.
 */
const prisma = new PrismaClient();
prisma.$connect()
    .then(() => {
        return console.info(chalk
            .green('Database initialised'));
    }).catch(console.error);

export default prisma;
