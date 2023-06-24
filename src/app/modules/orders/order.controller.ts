import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...order } = req.body;

    const result = await OrderService.createOrder(order);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'order created successfully!',
      data: result,
    });
  }
);

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
};
