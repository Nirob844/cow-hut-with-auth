import ApiError from '../../../errors/ApiError';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (user: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(user);

  if (!createdAdmin) {
    throw new ApiError(400, 'failed to create admin !');
  }
  return createdAdmin;
};
export const AdminService = {
  createAdmin,
};
