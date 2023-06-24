import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: 'Cow', // Assuming you have a 'Cow' model defined
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a 'User' model defined
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
