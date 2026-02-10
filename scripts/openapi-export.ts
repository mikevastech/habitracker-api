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

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);

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
