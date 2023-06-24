'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const mongoose_1 = require('mongoose');
const userSchema = new mongoose_1.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['seller', 'buyer'],
      required: true,
    },
    password: { type: String, required: true },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
      default: 0, // Default value for income field
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
exports.User = (0, mongoose_1.model)('User', userSchema);
