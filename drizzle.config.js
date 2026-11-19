import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  throw new Error('DATABASE_URL_UNPOOLED is not set in the .env file.');
}

if (databaseUrl.includes('[') || databaseUrl.includes(']')) {
  throw new Error('Replace the DATABASE_URL_UNPOOLED placeholders in .env with your Neon direct connection string.');
}

export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
