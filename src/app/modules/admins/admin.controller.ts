import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...admin } = req.body;
    const result = await AdminService.createAdmin(admin);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

// const loginAdmin = catchAsync(async (req: Request, res: Response) => {
//   const { ...loginData } = req.body;
//   const result = await AuthService.loginAdmin(loginData);

//   const { refreshToken, ...others } = result;
//   // set refresh token into cookie
//   const cookieOptions = {
//     secure: config.env === 'production',
//     httpOnly: true,
//   };

//   res.cookie('refreshToken', refreshToken, cookieOptions);

//   sendResponse<ILoginAdminResponse>(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User login successfully !',
//     data: others,
//   });
// });

export const AdminController = {
  createAdmin,
  //  loginAdmin,
};
