import { readFileSync, existsSync } from 'fs';
import path from 'path';

import { env } from '@shared/env';

export function getVersionDeveloper(): string {
  try {
    const pathPackage = path.resolve(__dirname, '..', '..', '..', '..', 'package.json');
    if (!existsSync(pathPackage)) {
      return 'FILE package.json NOT FOUND';
    }
    const packageJson = readFileSync(pathPackage, 'utf8');
    const packJson = JSON.parse(packageJson);
    const { version } = packJson;
    return version;
  } catch (error) {
    return error;
  }
}

export function getVersionProduction(): string {
  try {
    const pathVersion = path.resolve(__dirname, '..', '..', '..', 'version.json');
    if (!existsSync(pathVersion)) {
      return 'FILE version.json NOT FOUND';
    }
    const versionJson = readFileSync(pathVersion, 'utf8');
    const paserVersionJson = JSON.parse(versionJson);
    const { version } = paserVersionJson;
    return version;
  } catch (error) {
    return error;
  }
}

export function getVersion(): string {
  if (env.isProduction) {
    return getVersionProduction();
  }
  return getVersionDeveloper();
}

export function getEnvironment(): string {
  if (env.isProduction) {
    return 'PRODUCTION';
  }
  if (env.isDevelopment) {
    return 'DEVELOPMENT';
  }
  return 'TEST';
}
