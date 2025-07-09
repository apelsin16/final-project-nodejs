import path from 'path';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
