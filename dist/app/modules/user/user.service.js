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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const mongoose_1 = require('mongoose');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const paginationHelper_1 = require('../../../helpers/paginationHelper');
const user_constant_1 = require('./user.constant');
const user_model_1 = require('./user.model');
const createUser = user =>
  __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_model_1.User.create(user);
    if (!createdUser) {
      throw new ApiError_1.default(400, 'failed to create user !');
    }
    return createdUser;
  });
const getAllUsers = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters,
      filtersData = __rest(filters, ['searchTerm']);
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper_1.paginationHelpers.calculatePagination(
        paginationOptions
      );
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: user_constant_1.userSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }
    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield user_model_1.User.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const total = yield user_model_1.User.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getSingleUser = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
  });
const updateUser = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ _id: id });
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'user not found !'
      );
    }
    const { name } = payload,
      userData = __rest(payload, ['name']);
    const updatedUserData = Object.assign({}, userData);
    // dynamically handling
    if (name && Object.keys(name).length > 0) {
      Object.keys(name).forEach(key => {
        const nameKey = `name.${key}`; // `name.fisrtName`
        updatedUserData[nameKey] = name[key];
      });
    }
    const objectId = new mongoose_1.Types.ObjectId(id); // Convert string to ObjectId
    const result = yield user_model_1.User.findOneAndUpdate(
      objectId,
      updatedUserData,
      {
        new: true,
      }
    );
    return result;
  });
const deleteUser = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    return result;
  });
exports.UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
