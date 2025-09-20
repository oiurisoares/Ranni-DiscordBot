import { User } from './User';

export interface Guild {
    createdAt?: Date | null;
    defaultChannel?: string | null;
    id: string;
    isBlacklisted?: boolean | null;
    isPremium?: boolean | null;
    name?: string | null;
    updatedAt?: Date | null;
    user?: User[];
    welcomeChannel?: string | null;
}
