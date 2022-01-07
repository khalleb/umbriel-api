import { UserTypes } from '@shared/commons/constants';

export interface IUsersProps {
  id?: string;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: UserTypes;
}

export interface ITokenBodyCache {
  user_id: string;
  email: string;
  role: UserTypes;
  refresh_token: string;
  expires_date: Date;
}

export interface IRequestAuth {
  email: string;
  password: string;
}

export interface IResponseRefreshToken {
  token: string;
  refresh_token: string;
}

export interface IRequestForgotPassword {
  token: string;
  password?: string;
  password_confirmation?: string;
}
export interface IRequestUpdatePassword {
  password?: string;
  password_confirmation?: string;
}

export interface IResponseAuth {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    active: boolean;
    name: string;
    email: string;
    role: string;
  };
}

export type IUsersRequestDTO = IUsersProps;
