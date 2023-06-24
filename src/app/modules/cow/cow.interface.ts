import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location:
    | 'Dhaka'
    | 'Chattogram'
    | 'Barishal'
    | 'Rajshahi'
    | 'Sylhet'
    | 'Comilla'
    | 'Rangpur'
    | 'Mymensingh';
  breed:
    | 'Brahman'
    | 'Nellore'
    | 'Sahiwal'
    | 'Gir'
    | 'Indigenous'
    | 'Tharparkar'
    | 'Kankrej';
  weight: number;
  label: 'for sale' | 'sold out';
  category: 'Dairy' | 'Beef' | 'Dual Purpose';
  seller: Types.ObjectId | IUser; // Reference ID of the seller
};
export type CowModel = Model<ICow, Record<string, unknown>>;

export type ICowFilters = {
  searchTerm?: string;
  name?: string;
  location?: string;
  price?: string;
  bread?: string;
  label?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  seller?: Types.ObjectId;
};
