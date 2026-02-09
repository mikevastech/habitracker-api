/**
 * Drops and recreates the database from DATABASE_URL.
 * Connects to "postgres" to run DROP/CREATE, then you can run prisma migrate deploy.
 * Usage: npx ts-node scripts/drop-db.ts (or npm run db:drop)
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import { Client } from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const parsed = new URL(url);
const dbName = (parsed.pathname.slice(1) || '').replace(/\?.*$/, '').trim() || 'postgres';
if (dbName === 'postgres') {
  console.error(
    'Will not drop "postgres" database. DATABASE_URL should point to your app DB (e.g. habit_tracker_db).',
  );
  process.exit(1);
}
if (!/^[a-zA-Z0-9_]+$/.test(dbName)) {
  console.error('Invalid database name in URL');
  process.exit(1);
}

const adminUrl = url.replace(/\/[^/]*(\?.*)?$/, '/postgres$1');

async function main() {
  const client = new Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Dropped database "${dbName}"`);
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created database "${dbName}"`);
  } finally {
    await client.end();
  }
  console.log('Next: npm run prisma:deploy && npm run prisma:seed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
