import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';
import IBaseService from '@shared/infra/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/Pagination';

import { ITemplateDTO } from '../dtos/ITemplatesDTO';
import Templates from '../infra/typeorm/entities/Templates';
import TemplatesRepository from '../infra/typeorm/repositories/TemplatesRepository';
import ITemplatesRepository from '../repositories/ITemplatesRepository';

@injectable()
class TemplatesServices implements IBaseService {
  constructor(
    @inject(TemplatesRepository.name)
    private _templatesRepository: ITemplatesRepository,
  ) {}

  private datasValidate(data: ITemplateDTO): ITemplateDTO {
    if (!data) {
      throw new AppError(i18n('template.enter_the_data'));
    }
    if (!data.name) {
      throw new AppError(i18n('template.enter_the_name_data'));
    }
    if (!data.content) {
      throw new AppError(i18n('template.enter_the_content'));
    }

    data.name = data.name.trim();
    data.content = data.content.trim();
    data.name = data.name.toUpperCase();

    if (data.name.length > 100) {
      throw new AppError(i18n('template.the_name_cannot_be_longe_than_characters'));
    }
    if (data.content.length > 15000) {
      throw new AppError(i18n('template.the_name_cannot_be_longe_than_characters_content'));
    }
    return data;
  }

  public async store(req: Request): Promise<Templates> {
    const { body } = req;
    const template = await this.storeRepository(body);
    return template;
  }

  public async storeRepository(data: ITemplateDTO): Promise<Templates> {
    const checkName = await this._templatesRepository.findByName(data.name);
    if (checkName) {
      throw new AppError(i18n('template.existing_name'));
    }
    const template = await this._templatesRepository.store(data as Templates);
    return template;
  }

  public async update(req: Request): Promise<Templates> {
    const { body } = req;
    const template = await this.updateRepository(body);
    return template;
  }

  public async updateRepository(datas: ITemplateDTO): Promise<Templates> {
    const data = this.datasValidate(datas);

    if (!data.id) {
      throw new AppError(i18n('validations.enter_your_template_details'));
    }
    const checkName = await this._templatesRepository.findByName(data.name);
    if (checkName) {
      if (checkName.id !== data.id) {
        throw new AppError(i18n('template.existing_name'));
      }
    }
    const templateData = await this._templatesRepository.findById(data.id);
    if (templateData) {
      templateData.name = data.name;
      templateData.content = data.content;
    }
    const template = await this._templatesRepository.update(templateData as Templates);
    return template;
  }

  public async delete(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.deleteRepository(id);
    return result;
  }

  public async deleteRepository(id: string): Promise<any> {
    if (!id) {
      throw new AppError(i18n('template.enter_your_template_details'));
    }
    const response = await this._templatesRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('template.the_tag_cannot_be_removed'));
    }
    return i18n('template.registration_removed_successfully');
  }

  public async show(req: Request): Promise<Templates | undefined> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.showRepository(id);
    return result;
  }

  public async showRepository(id: string): Promise<Templates | undefined> {
    if (!id) {
      throw new AppError(i18n('template.enter_your_template_details'));
    }
    const template = await this._templatesRepository.findById(id);
    return template;
  }

  public async inactivateActivate(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.inactivateActivateRepository(id);
    return result;
  }

  public async inactivateActivateRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('template.enter_your_template_details'));
    }
    const tag = await this._templatesRepository.findById(id);
    if (!tag) {
      throw new AppError(i18n('template.template_not_found_in_the_database'));
    }
    const response = await this._templatesRepository.inactivateActivate(tag);
    if (!response) {
      throw new AppError(i18n('template.the_status_of_the_tag_could_not_changed'));
    }
    return `${i18n('template.template')} ${tag.active ? i18n('labels.activated') : i18n('labels.inactivated')}`;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    data.status = 'both';
    const list = await this._templatesRepository.index(data);
    return list;
  }
}
export default TemplatesServices;
