"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const cow_controller_1 = require("./cow.controller");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER), cow_controller_1.CowController.getSingleCow);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.updateCow);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.deleteCow);
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.createCow);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER), cow_controller_1.CowController.getAllCows);
exports.CowRoutes = router;
