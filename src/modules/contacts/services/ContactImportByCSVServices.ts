import { Request } from 'express';

import csvtojson from 'csvtojson';
import { createReadStream } from 'fs';
import { join } from 'path';
import { pipeline, Transform } from 'stream';
import { inject, injectable } from 'tsyringe';
import { promisify } from 'util';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import { i18n } from '@shared/internationalization';

import { IResponseImport } from '../dtos/IContactImportByCSVDTO';
import { ContactsServices } from './ContactsServices';

const pipelineAsync = promisify(pipeline);

@injectable()
class ContactImportByCSVServices {
  constructor(
    @inject('ContactsServices')
    private _contactsServices: ContactsServices,
  ) { }

  async execute(request: Request): Promise<IResponseImport | HttpResponseMessage | undefined> {
    try {
      const fileName = request?.file?.filename;
      const { tags } = request.body;

      if (!fileName) {
        throw new AppError(i18n('validations.enter_the_data_file'));
      }

      const contactsFileStream = createReadStream(join(uploadConfig.tmpFolder, fileName));
      if (!contactsFileStream) {
        throw new AppError(i18n('validations.enter_the_data_file'));
      }
      let totalLines = 0;
      let totalErrors = 0;
      let totalImporteds = 0;
      const errosToReturn: string[] = [];
      const tagsValidate = tags ? await this._contactsServices.validateAndReturnTagID(tags.split(';')) : [];
      const handleStream = new Transform({
        transform: async (chunk, encoding, cb) => {
          try {
            const line: string = chunk.toString();
            if (!line) {
              return cb(null, 'success');
            }
            totalLines += 1;
            const columns = line.split('|');
            const emails = columns[0].trim();
            const name = columns.length > 1 ? columns[1] : undefined;

            const emailsSplit = emails.includes(';') ? emails.split(';') : emails.split(',');
            const resultsPromise = emailsSplit.map(async (email: string) => {
              const result = await this._contactsServices.storeOrUpdateByRequestPublicRepository(
                name,
                email,
                tagsValidate,
              );
              return result;
            });
            await Promise.all(resultsPromise);
            totalImporteds += 1;
            return cb(null, 'success');
          } catch (error) {
            totalErrors += 1;
            errosToReturn.push(error instanceof AppError ? error.message : (error as string));
            return cb(null, 'error');
          }
        },
      });

      await pipelineAsync(contactsFileStream, csvtojson({ output: 'line', noheader: true, trim: true }), handleStream);

      return {
        total_lines: totalLines,
        total_imported: totalImporteds,
        total_errors: totalErrors,
        errors: errosToReturn,
      };
    } catch (error) {
      return messageResponse(error as string);
    }
  }
}

export { ContactImportByCSVServices };
