"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controller/UserController");
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
exports.UserRouter = express_1.default.Router();
exports.UserRouter.post('/sign-up', UserController_1.SignUpController);
exports.UserRouter.post('/login', UserController_1.LoginController);
exports.UserRouter.post('/update-user', AuthorizationMiddleware_1.checkAuthorization, UserController_1.updateUser);
