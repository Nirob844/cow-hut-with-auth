'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderService = exports.createOrder = void 0;
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const cow_model_1 = require('../cow/cow.model');
const user_model_1 = require('../user/user.model');
const order_model_1 = require('./order.model');
const createOrder = orderData =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { cow: cowId, buyer: buyerId } = orderData;
    // Find the cow being bought
    const cow = yield cow_model_1.Cow.findById(cowId);
    if (!cow) {
      throw new Error('Cow not found');
    }
    // Check if the cow is already sold
    if (cow.label === 'sold out') {
      throw new Error('Cow is already sold');
    }
    // Find the buyer
    const buyer = yield user_model_1.User.findById(buyerId);
    if (!buyer) {
      throw new Error('Buyer not found');
    }
    if (buyer.role !== 'buyer') {
      throw new Error('Forbidden: Access denied');
    }
    // Simulate the payment process
    const totalPrice = cow.price;
    const buyerBalance = buyer.budget;
    if (totalPrice > buyerBalance) {
      throw new Error('Insufficient funds');
    }
    // Start a transaction
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
      // Update the cow's status to 'sold'
      cow.label = 'sold out';
      yield cow.save();
      // Deduct the price from the buyer's budget
      buyer.budget -= totalPrice;
      yield buyer.save();
      // Increase the seller's income by the same amount
      const seller = yield user_model_1.User.findById(cow.seller);
      if (!seller) {
        throw new Error('Seller not found');
      }
      seller.income += totalPrice;
      yield seller.save();
      // Create the order record
      const order = new order_model_1.Order(orderData);
      yield order.save();
      // Commit the transaction
      yield session.commitTransaction();
      session.endSession();
      return order;
    } catch (error) {
      // Rollback the transaction if any error occurs
      yield session.abortTransaction();
      session.endSession();
      throw error;
    }
  });
exports.createOrder = createOrder;
const getAllOrders = (userId, role) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let result = null; // Declare the result variable
    try {
      // Check the role and handle access based on the role
      if (role === 'admin') {
        // Admin can access all orders
        result = yield order_model_1.Order.find()
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
      } else if (role === 'buyer') {
        // Buyer can access their own orders
        result = yield order_model_1.Order.find({ buyer: userId })
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
      } else if (role === 'seller') {
        // Seller can access orders related to their cows
        const seller = yield user_model_1.User.findById(userId);
        if (!seller) {
          throw new ApiError_1.default(
            http_status_1.default.NOT_FOUND,
            'Seller not found'
          );
        }
        const sellerCows = yield cow_model_1.Cow.find({ seller: userId });
        const result = yield order_model_1.Order.find({
          cow: { $in: sellerCows },
        })
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
        return result;
      } else {
        // Invalid role
        throw new ApiError_1.default(
          http_status_1.default.UNAUTHORIZED,
          'You are not authorized'
        );
      }
    } catch (error) {
      // Handle errors
      throw new ApiError_1.default(
        http_status_1.default.INTERNAL_SERVER_ERROR,
        'Internal Server Error'
      );
    }
    if (!result) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Order not found'
      );
    }
    return result;
  });
const getSingleOrder = (orderId, userId, role) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let result = null; // Declare the result variable
      // Check the role and handle access based on the role
      if (role === 'admin') {
        // Admin can access all orders
        result = yield order_model_1.Order.findById(orderId)
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
      } else if (role === 'buyer') {
        // Buyer can access their own orders
        result = yield order_model_1.Order.findOne({
          _id: orderId,
          buyer: userId,
        })
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
      } else if (role === 'seller') {
        // Seller can access orders related to their cows
        const seller = yield user_model_1.User.findById(userId);
        if (!seller) {
          throw new ApiError_1.default(
            http_status_1.default.NOT_FOUND,
            'Seller not found'
          );
        }
        const sellerCows = yield cow_model_1.Cow.find({ seller: userId });
        result = yield order_model_1.Order.findOne({
          _id: orderId,
          cow: { $in: sellerCows },
        })
          .populate('cow')
          .populate({
            path: 'buyer',
            model: 'User',
          })
          .populate({
            path: 'cow',
            populate: { path: 'seller', model: 'User' },
          })
          .exec();
      } else {
        // Invalid role
        throw new ApiError_1.default(
          http_status_1.default.UNAUTHORIZED,
          'You are not authorized'
        );
      }
      if (!result) {
        throw new ApiError_1.default(
          http_status_1.default.NOT_FOUND,
          'Order not found'
        );
      }
      return result;
    } catch (error) {
      // Handle errors
      throw new ApiError_1.default(
        http_status_1.default.INTERNAL_SERVER_ERROR,
        'Internal Server Error'
      );
    }
  });
exports.OrderService = {
  createOrder: exports.createOrder,
  getAllOrders,
  getSingleOrder,
};
