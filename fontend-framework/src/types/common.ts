import { AxiosRequestConfig } from 'axios';
export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  img?: string;
  data?: T;
  token?: string;
}

export interface RequestConfigOptions extends AxiosRequestConfig {
  noToken?: boolean;
  neverCancel?: boolean;
}

export interface AuthForm {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
  license: string;
}

export interface BasicOptionsItemType {
  value: string | number;
  label: string | number;
  status?: string | number;
  color?: string;
  disabled?: boolean;
  children?: BasicOptionsItemType[];
}
