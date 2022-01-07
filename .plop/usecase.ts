import { NodePlopAPI } from 'plop';
import { readdirSync } from 'fs';
import path from 'path';

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

export default function (plop: NodePlopAPI) {
  plop.setGenerator('usecase', {
    description: 'Base Use Case with API Route',
    prompts: [
      {
        type: 'list',
        name: 'module',
        message: 'Select module',
        choices: getDirectories(path.resolve(__dirname, '../src/modules')),
      },
      {
        type: 'list',
        name: 'typeDataBase',
        message: 'Select type database',
        choices: ['POSTGRES', 'MONGO'],
      },
      {
        type: 'confirm',
        name: 'shouldIncludeEntity',
        message: 'Should include Entity?',
        default: true,
      },
      {
        type: 'input',
        name: 'nameEntity',
        message: 'Name entity',
        when: answers => {
          return answers.shouldIncludeEntity;
        },
      },
      {
        type: 'confirm',
        name: 'shouldIncludeRepository',
        message: 'Should include Repository?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'shouldIncludeService',
        message: 'Should include Service?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'shouldIncludeController',
        message: 'Include HTTP controller?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'shouldIncludeDto',
        message: 'Include DTO?',
        default: true,
      },
    ],

    actions: answers => {
      const actions = [];
      if (answers?.typeDataBase === 'POSTGRES') {
        if (answers?.shouldIncludeEntity) {
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/infra/typeorm/entities/{{pascalCase nameEntity}}.ts',
            templateFile: 'templates/entity.ts.hbs',
            skipIfExists: true,
          });
        }
        if (answers?.shouldIncludeRepository) {
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/repositories/I{{pascalCase nameEntity}}Repository.ts',
            templateFile: 'templates/irepository-postgres.ts.hbs',
            skipIfExists: true,
          });
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/repositories/index.ts',
            templateFile: 'templates/index-irepository.ts.hbs',
            skipIfExists: true,
          });
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/infra/typeorm/repositories/{{pascalCase nameEntity}}Repository.ts',
            templateFile: 'templates/repository-postgres.ts.hbs',
            skipIfExists: true,
          });
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/infra/typeorm/repositories/index.ts',
            templateFile: 'templates/index-repository.ts.hbs',
            skipIfExists: true,
          });
        }
        if (answers?.shouldIncludeService) {
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/services/{{pascalCase nameEntity}}Services.ts',
            templateFile: 'templates/services.ts.hbs',
            skipIfExists: true,
          });
        }
        if (answers?.shouldIncludeController) {
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/infra/http/controllers/{{pascalCase nameEntity}}Controller.ts',
            templateFile: 'templates/controller.ts.hbs',
            skipIfExists: true,
          });
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/infra/http/routes/{{lowerCase nameEntity}}.routes.ts',
            templateFile: 'templates/routes.ts.hbs',
            skipIfExists: true,
          });
        }
        if (answers?.shouldIncludeDto) {
          actions.push({
            type: 'add',
            path: '../src/modules/{{module}}/dtos/I{{pascalCase nameEntity}}DTO.ts',
            templateFile: 'templates/dto.ts.hbs',
            skipIfExists: true,
          });
        }
      } else if (answers?.typeDataBase === 'MONGO') {
      }
      return actions;
    },
  });
}
