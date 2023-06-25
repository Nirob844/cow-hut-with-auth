/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};
export type IAdmin = {
  id: string;
  phoneNumber: string;
  role: 'admin';
  password: string;
  needsPasswordChange: true | false;
  name: AdminName;
  address: string;
};

//export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type AdminModel = {
  isAdminExist(
    id: string
  ): Promise<Pick<IAdmin, 'id' | 'password' | 'role' | 'phoneNumber'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

export type ILoginAdmin = {
  id: string;
  phoneNumber?: string;
  password: string;
};
export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
