import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...user } = req.body;
    const result = await AuthService.createUser(user);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

export const AuthController = {
  createUser,
};
