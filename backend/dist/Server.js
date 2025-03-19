"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = require("./routes/UserRoutes");
const ApiRoutes_1 = require("./routes/ApiRoutes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/users', UserRoutes_1.UserRouter);
app.use('/api', ApiRoutes_1.ApiRouter);
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
