"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("./../../../enums/user");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.post('/create-admin', admin_controller_1.AdminController.createAdmin);
router.post('/login', admin_controller_1.AdminController.loginAdmin);
router.post('/refresh-token', admin_controller_1.AdminController.refreshToken);
router.get('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getAdminProfile);
router.patch('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.updateAdminProfile);
exports.AdminRoutes = router;
