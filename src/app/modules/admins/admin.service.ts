import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IAdmin,
  ILoginAdmin,
  ILoginAdminResponse,
  IRefreshTokenResponse,
} from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(admin);
  if (!createdAdmin) {
    throw new ApiError(400, 'failed to create admin !');
  }
  return createdAdmin;
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { password, phoneNumber } = payload;

  if (!phoneNumber || !password) {
    throw new ApiError(httpStatus.NOT_FOUND, 'phone number & password needed');
  }
  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
  //create access token & refresh token
  const { phoneNumber: ph, role } = isAdminExist;

  const accessToken = jwtHelpers.createToken(
    { ph, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { ph, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { ph } = verifiedToken;

  // checking deleted user's refresh token
  const isAdminExist = await Admin.isAdminExist(ph);
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'admin does not exist');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isAdminExist.phoneNumber,
      role: isAdminExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
