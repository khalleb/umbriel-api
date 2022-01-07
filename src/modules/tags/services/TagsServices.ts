import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';

import { ITagsDTO } from '../dtos/ITagsDTO';
import { Tags } from '../infra/typeorm/entities/Tags';
import { ITagsRepository } from '../repositories';

@injectable()
class TagsServices implements IBaseService {
  constructor(
    @inject('TagsRepositories')
    private _tagsRepository: ITagsRepository,
  ) {}

  private datasValidate(data: ITagsDTO): ITagsDTO {
    if (!data) {
      throw new AppError(i18n('tag.enter_the_data'));
    }
    if (!data.name) {
      throw new AppError(i18n('tag.enter_the_name_data'));
    }
    data.name = data.name.trim();
    data.name = data.name.toUpperCase();
    if (data.name.length > 50) {
      throw new AppError(i18n('tag.the_name_cannot_be_longe_than_characters'));
    }
    return data;
  }

  public async store(req: Request): Promise<Tags> {
    const { body } = req;
    const data = this.datasValidate(body);

    const checkName = await this._tagsRepository.findByName(data.name);
    if (checkName) {
      throw new AppError(i18n('tag.existing_name'));
    }

    const tag = await this._tagsRepository.store(data as Tags);
    return tag;
  }

  public async update(req: Request): Promise<Tags> {
    const { body } = req;
    const data = this.datasValidate(body);

    if (!data.id) {
      throw new AppError(i18n('tag.enter_your_ID'));
    }
    const checkName = await this._tagsRepository.findByName(data.name);
    if (checkName && checkName.id !== data.id) {
      throw new AppError(i18n('tag.existing_name'));
    }
    const tag = await this._tagsRepository.update(data as Tags);
    return tag;
  }

  public async delete(req: Request): Promise<any> {
    const { query } = req;
    const id = query?.id as string;
    if (!id) {
      throw new AppError(i18n('tag.enter_your_tag_details'));
    }
    const response = await this._tagsRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('tag.the_tag_cannot_be_removed'));
    }
    return i18n('tag.registration_removed_successfully');
  }

  public async show(req: Request): Promise<any | undefined> {
    const { query } = req;
    const id = query?.id as string;

    if (!id) {
      throw new AppError(i18n('tag.enter_your_tag_details'));
    }
    const tag = await this._tagsRepository.findById(id);
    return tag;
  }

  public async inactivateActivate(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query?.id as string;

    if (!id) {
      throw new AppError(i18n('tag.enter_your_tag_details'));
    }
    const tag = await this._tagsRepository.findById(id);
    if (!tag) {
      throw new AppError(i18n('tag.logged_tag_not_found_the_database'));
    }
    const response = await this._tagsRepository.inactivateActivate(tag);
    if (!response) {
      throw new AppError(i18n('tag.the_status_of_the_tag_could_not_changed'));
    }
    return messageResponse(`${i18n('tag.tag')} ${tag.active ? i18n('labels.activated') : i18n('labels.inactivated')}`);
  }

  public async findByNameLike(req: Request): Promise<Tags[]> {
    const { query } = req;
    let name = query?.name as string;
    if (!name) {
      throw new AppError(i18n('tag.enter_the_tag_name_for_search'));
    }
    name = name.trim();
    name = name.toUpperCase();
    const tags = await this._tagsRepository.findByNameLike(name);
    return tags;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const list = await this._tagsRepository.index(data);
    return list;
  }
}

export { TagsServices };
