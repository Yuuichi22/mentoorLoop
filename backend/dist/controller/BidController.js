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
exports.getAllBidsOfUser = exports.removeBidById = exports.placeBid = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const placeBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bidValidationSchema = zod_1.z.object({
        project_id: zod_1.z.coerce.number(),
        user_id: zod_1.z.coerce.number()
    });
    const { project_id } = req.body;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim();
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    const payload = jsonwebtoken_1.default.verify(token, "mysecretkey");
    const user_id = payload.id;
    console.log(req.body);
    const result = bidValidationSchema.safeParse({ project_id, user_id });
    if (!result.success) {
        console.log('ran here');
        res.status(400).json({ message: "Invalid foramt", errors: result.error });
        return;
    }
    try {
        const response = yield prisma.bidder.create({
            data: result.data
        });
        res.status(201).json({ message: "bid created succesully", data: response });
    }
    catch (e) {
        res.status(400).json({ error: e });
    }
});
exports.placeBid = placeBid;
const removeBidById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid Bid ID" });
        return;
    }
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim();
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    const payload = jsonwebtoken_1.default.verify(token, "mysecretkey");
    const user_id = payload.id;
    console.log('hre re');
    try {
        const response = yield prisma.bidder.delete({
            where: {
                id,
                user_id
            }
        });
        console.log("removed : ", response);
        res.json({ message: "successfully removed bid", response });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
exports.removeBidById = removeBidById;
const getAllBidsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim();
    try {
        // Check if the token exists
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }
        // Verify the token
        const payload = jsonwebtoken_1.default.verify(token, "mysecretkey"); // Ensure payload has the correct type
        // Fetch bids for the user
        const bids = yield prisma.bidder.findMany({
            where: {
                user_id: payload.id,
            },
            include: {
                project: true, // Include project details (if applicable)
            },
        });
        console.log("bids of user : ", bids);
        // Return the bids as a response
        res.status(200).json(bids);
    }
    catch (e) {
        console.error('Error in getAllBidsOfUser:', e);
        // Handle specific JWT errors
        if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
    }
});
exports.getAllBidsOfUser = getAllBidsOfUser;
