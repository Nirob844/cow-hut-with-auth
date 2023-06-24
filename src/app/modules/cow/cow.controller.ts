import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constant';
import { ICow } from './cow.interface';
import { CowService } from './cow.service';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cow } = req.body;

    const result = await CowService.createCow(cow);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'cow created successfully!',
      data: result,
    });
  }
);

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const { minPrice, maxPrice } = req.query;

  const result = await CowService.getAllCows(
    filters,
    paginationOptions,
    Number(maxPrice),
    Number(minPrice)
  );

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await CowService.updateCow(id, updatedData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully !',
    data: result,
  });
});

const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowService.deleteCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully !',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
