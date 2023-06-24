import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};
export type IAdmin = {
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: AdminName;
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
