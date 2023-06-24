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
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const http_status_1 = __importDefault(require('http-status'));
const globalErrorHandler_1 = __importDefault(
  require('./app/middlewares/globalErrorHandler')
);
const routes_1 = __importDefault(require('./app/routes'));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Application routes
app.use('/api/v1', routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
// handle not found
app.use((req, res) => {
  res.status(http_status_1.default.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not found',
      },
    ],
  });
});
//Testing
app.get('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res.send('Working Successfully');
    // throw new Error('testing')
  })
);
exports.default = app;
