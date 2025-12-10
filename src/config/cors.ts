import cors from 'cors';

/**
 * Configure CORS for credentialed requests
 * --
 * allow external clients with credentials.
 * Accepts any origin while validating the request via callback.
 * Required for:
 * - cookies;
 * - cross-domain API usage;
 * - tokens.
 */
export const corsConfig = cors({
    credentials: true,
    origin: (origin, callback) => callback(null, origin),
});
