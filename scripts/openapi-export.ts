/**
 * Exports the OpenAPI (Swagger) spec to JSON and optionally YAML.
 * Usage: npx ts-node -r tsconfig-paths/register scripts/openapi-export.ts
 *    or: npm run openapi:export
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { getSwaggerConfig } from '../src/swagger.config';

const AUTH_PATH = '/auth/{path}';
const PATH_PARAM = {
  name: 'path',
  in: 'path' as const,
  required: true,
  schema: { type: 'string' },
  description: 'Better Auth route segment (e.g. sign-in, callback/google)',
};

function fixAuthPathForClientGen(document: Record<string, unknown>) {
  const paths = document.paths as Record<string, Record<string, unknown>> | undefined;
  if (!paths?.[AUTH_PATH]) return;

  const authPath = paths[AUTH_PATH];
  if (!authPath || typeof authPath !== 'object') return;

  authPath.parameters = [PATH_PARAM];
  delete authPath.search;
}

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config) as unknown as Record<string, unknown>;

  fixAuthPathForClientGen(document);

  const outDir = process.env.OPENAPI_OUT_DIR || process.cwd();
  const jsonPath = join(outDir, 'openapi.json');

  writeFileSync(jsonPath, JSON.stringify(document, null, 2), 'utf-8');
  console.log('Written:', jsonPath);

  await app.close();
}

exportOpenApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
