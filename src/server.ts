import { Collection, REST, Routes } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import express, {
    Application, Request, Response, NextFunction,
} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fileSystem from 'fs';
import helmet from 'helmet';
import https from 'https';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import chalk from 'chalk';
import { Guild } from './models/Guild';
import router from './routes';
import discord from './config/discordjs';
import guildService from './services/guildService';

dotenv.config();
export const commands = new Collection<string, any>();
const commandsToDeploy: any[] = [];
const mediaFilesPath = path.join(__dirname, 'assets/shared');
const server: Application = express();

const storage: StorageEngine = multer.diskStorage({
    destination(_req, _file: Express.Multer.File, callback) {
        callback(null, mediaFilesPath);
    },
    filename(_req, file: Express.Multer.File, callback) {
        callback(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});
export const upload = multer({
    limits: {
        files: 15,
        fileSize: 500 * 1024 * 1024,
    },
    storage,
    fileFilter(_req, file, callback) {
        if (!process.env.SUPPORTED_MIME_TYPES!.split(',')
            .includes(file.mimetype)) {
            callback(new Error('Unsupported file type'));
            return;
        }
        callback(null, true);
    },
});

server.use(cors({
    credentials: true,
    origin: (origin, callback) => { return callback(null, origin); },
}));
server.use(cookieParser(process.env.JWT_SECRET));
server.set('trust proxy', true);
server.use(
    '/sharedFiles',
    express.static(mediaFilesPath),
);
server.use(express.json({
    inflate: true,
    limit: '1mb',
    strict: true,
    type: 'application/json',
}));
server.use(helmet({
    frameguard: {
        action: 'deny',
    },
    hsts: {
        includeSubDomains: true,
        maxAge: 31536000,
        preload: true,
    },
    referrerPolicy: {
        policy: 'no-referrer',
    },
    xssFilter: true,
}));
express.urlencoded({ extended: true });
server.use('/api', router);

server.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(chalk
        .red(`Error: ${error.message}`));
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
});

server.use((_req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

const httpsOption = {
    cert: fileSystem.readFileSync(
        process.env.SSL_CERTIFICATE!,
        'utf-8',
    ),

    key: fileSystem.readFileSync(
        process.env.SSL_KEY!,
        'utf-8',
    ),
};

const httpsServer = https.createServer(httpsOption, server);
const { PORT } = process.env || 3000;
httpsServer.listen(PORT, () => {
    console.info(chalk
        .green(`Server is running on port ${PORT}`));
});

server.get('/sharedFiles/download/:file', (req: Request, res: Response) => {
    try {
        if (!req?.params?.file || !req.signedCookies?.cookie) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            }); return;
        }

        const filePath = path.join(mediaFilesPath, req.params.file);
        if (!fileSystem.existsSync(filePath)) {
            res.status(404).json({
                error: 'No such file or directory',
            }); return;
        }
        res.download(filePath);
    } catch (error: any) {
        console.error('Error downloading file:', error.message);
        const statusCode = error.status || 500;
        const errorDetails = {
            details: error.message || 'An unexpected error occurred',
            error: 'Failed to download file',
        };
        res.status(statusCode).json(errorDetails);
    }
});

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fileSystem
    .readdirSync(commandsPath)
    .filter((file) => {
        return file.endsWith('.ts')
            || file.endsWith('.js');
    });

commandFiles.forEach(async (file) => {
    const { default: command } = await import(path.join(commandsPath, file));
    if (!('data' in command || 'execute' in command)) {
        console.warn(`Command ${file} is missing a property.`);
        return;
    }
    commands.set(command.data.name, command);
    commandsToDeploy.push(command.data.toJSON());
});

if (process.env.DEPLOY_COMMANDS === 'true') {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
    (async () => {
        try {
            const guilds: Guild[] = await guildService.getAll();
            if (!guilds) return;
            console.info(chalk
                .blue('\nStarted refreshing commands.'));
            guilds.forEach(async (guild) => {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, guild.id),
                    { body: commandsToDeploy },
                );
            });
            console.info(chalk
                .blue('Successfully reloaded commands.'));
        } catch (error: any) {
            console.error(chalk
                .red('Error registering commands:', error));
        }
    })();
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fileSystem
    .readdirSync(eventsPath)
    .filter((file) => {
        return file.endsWith('.ts')
            || file.endsWith('.js');
    });

eventFiles.forEach(async (file) => {
    const { default: event } = await import(path.join(eventsPath, file));
    if (event.once) {
        discord.once(event.name, (...args) => {
            return event.execute(...args, discord);
        });
    } else {
        discord.on(event.name, (...args) => {
            return event.execute(...args, discord);
        });
    }
});

discord.login(process.env.DISCORD_TOKEN)
    .catch((error: Error) => {
        console.error(chalk
            .red('Error logging in to Discord:', error.message));
    });
