/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

export type IUser = {
  id: string;
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
  name: UserName;
  address: string;
  budget: number;
  income: number;
};

//export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'phoneNumber'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  budget?: string;
  income?: string;
};
