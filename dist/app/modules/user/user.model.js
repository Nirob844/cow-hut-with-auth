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
exports.User = void 0;
const bcrypt_1 = __importDefault(require('bcrypt'));
const mongoose_1 = require('mongoose');
const config_1 = __importDefault(require('../../../config'));
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
    password: {
      type: String,
      required: true,
      select: 0,
    },
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
//is user exist
userSchema.statics.isUserExist = function (phoneNumber) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield exports.User.findOne(
      { phoneNumber },
      { id: 1, password: 1, role: 1, phoneNumber: 1 }
    );
  });
};
// is password match
userSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(givenPassword, savedPassword);
  });
};
// hash user password
// userSchema.pre('save', async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this;
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds)
//   );
//   next();
// });
userSchema.pre('save', function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if (user.isModified('password')) {
      try {
        const saltRounds = Number(config_1.default.bcrypt_salt_rounds);
        const hashedPassword = yield bcrypt_1.default.hash(
          user.password,
          saltRounds
        );
        user.password = hashedPassword;
        next();
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  });
});
exports.User = (0, mongoose_1.model)('User', userSchema);
