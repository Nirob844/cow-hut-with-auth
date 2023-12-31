/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
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
  const { id, role } = isAdminExist;

  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role },
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

  const { id } = verifiedToken;

  // checking deleted user's refresh token
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: admin.id,
      role: admin.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const getAdminProfile = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById({ _id: id });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateAdminProfile = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'admin not found !');
  }

  const { name, ...userData } = payload;

  const updatedUserData: Partial<IAdmin> = { ...userData };

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.fisrtName`
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const objectId = new Types.ObjectId(id); // Convert string to ObjectId
  const result = await Admin.findOneAndUpdate(objectId, updatedUserData, {
    new: true,
  });
  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getAdminProfile,
  updateAdminProfile,
};
