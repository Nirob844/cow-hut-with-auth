import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new ApiError(400, 'failed to create user !');
  }
  return createdUser;
};

export const AuthService = {
  createUser,
};
