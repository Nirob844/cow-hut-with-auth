import ApiError from '../../../errors/ApiError';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(admin);
  if (!createdAdmin) {
    throw new ApiError(400, 'failed to create admin !');
  }
  return createdAdmin;
};

// const loginAdmin = async (
//   payload: ILoginAdmin
// ): Promise<ILoginAdminResponse> => {
//   const { id, password } = payload;

//   const isAdminExist = await Admin.isAdminExist(id);

//   if (!isAdminExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
//   }
//   if (
//     isAdminExist.password &&
//     !(await Admin.isPasswordMatched(password, isAdminExist.password))
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
//   }

//   //create access token & refresh token
//   const { id: AdminId, role, needsPasswordChange } = isAdminExist;

//   const accessToken = jwtHelpers.createToken(
//     { userId, role },
//     config.jwt.secret as Secret,
//     config.jwt.expires_in as string
//   );

//   const refreshToken = jwtHelpers.createToken(
//     { userId, role },
//     config.jwt.refresh_secret as Secret,
//     config.jwt.refresh_expires_in as string
//   );

//   return {
//     accessToken,
//     refreshToken,
//     needsPasswordChange,
//   };
// };

export const AdminService = {
  createAdmin,
};
