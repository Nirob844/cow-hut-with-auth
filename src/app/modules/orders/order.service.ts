import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

// const createOrder = async (cow: IOrder): Promise<IOrder | null> => {
//   const createdCow = await Order.create(cow);

//   if (!createdCow) {
//     throw new ApiError(400, 'failed to create Cow !');
//   }
//   return createdCow;
// };

export const createOrder = async (orderData: IOrder): Promise<IOrder> => {
  const { cow: cowId, buyer: buyerId } = orderData;

  // Find the cow being bought
  const cow = await Cow.findById(cowId);

  if (!cow) {
    throw new Error('Cow not found');
  }

  // Check if the cow is already sold
  if (cow.label === 'sold out') {
    throw new Error('Cow is already sold');
  }

  // Find the buyer
  const buyer = await User.findById(buyerId);

  if (!buyer) {
    throw new Error('Buyer not found');
  }

  // Simulate the payment process
  const totalPrice = cow.price;
  const buyerBalance = buyer.budget;

  if (totalPrice > buyerBalance) {
    throw new Error('Insufficient funds');
  }

  // Start a transaction
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Update the cow's status to 'sold'
    cow.label = 'sold out';
    await cow.save();

    // Deduct the price from the buyer's budget
    buyer.budget -= totalPrice;
    await buyer.save();

    // Increase the seller's income by the same amount
    const seller = await User.findById(cow.seller);
    if (!seller) {
      throw new Error('Seller not found');
    }
    seller.income += totalPrice;
    await seller.save();

    // Create the order record
    const order = new Order(orderData);
    await order.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const getAllOrders = async (): Promise<IOrder[] | null> => {
  const result = await Order.find().populate('cow').populate('buyer');
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
