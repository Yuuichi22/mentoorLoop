"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.headers['authorization'];
    if (!authToken || !authToken.startsWith('Bearer ')) {
        console.log("From checkAuth middlware");
        res.json({ message: "Invalid json token" });
        return;
    }
    const token = authToken.slice(7).trim();
    try {
        const decode = yield jsonwebtoken_1.default.verify(token, "mysecretkey");
        console.log("decoded data  : ", decode);
        console.log(token);
        next();
    }
    catch (e) {
        console.log("From checkAuth middlware Exception");
        res.json({ message: e });
        return;
    }
});
exports.checkAuthorization = checkAuthorization;
