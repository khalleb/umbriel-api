import { Tags } from '@modules/tags/infra/typeorm/entities/Tags';

export interface IContactsProps {
  id?: string;
  name?: string;
  email: string;
  subscribed: boolean;
}

interface IContactsRequestProps {
  tags: string[];
}

interface IContactsCreateProps {
  tags: Tags[];
}

export type IContactsRequestDTO = IContactsProps & IContactsRequestProps;

export type IContactsCreateDTO = IContactsProps & IContactsCreateProps;
