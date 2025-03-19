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
exports.updatePost = exports.deletePostById = exports.createPost = exports.getPostById = exports.getAllPostsOfUser = exports.getAllPosts = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.post.findMany();
        res.json({ posts: response });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error });
    }
});
exports.getAllPosts = getAllPosts;
const getAllPostsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = zod_1.z.string().safeParse((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim());
        if (token.success) {
            const decoded = jsonwebtoken_1.default.verify(token.data, "mysecretkey");
            const response = yield prisma.post.findMany({
                where: {
                    user_id: decoded.id
                }
            });
            res.json({ data: response });
        }
        else {
            res.status(400).json({ message: "INVALID JWT" });
        }
    }
    catch (e) {
        res.status(500).json({ error: {
                message: e
            } });
    }
});
exports.getAllPostsOfUser = getAllPostsOfUser;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid post ID" });
            return;
        }
        const response = yield prisma.post.findUnique({
            where: { id }
        });
        if (!response) {
            res.status(404).json({ error: "Post not found" });
            return;
        }
        res.json({ post: response });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch post" });
    }
});
exports.getPostById = getPostById;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postValidationSchema = zod_1.z.object({
        title: zod_1.z.string(),
        content: zod_1.z.string(),
        tags: zod_1.z.array(zod_1.z.string()),
        attachments: zod_1.z.array(zod_1.z.string()),
        user_id: zod_1.z.coerce.number(),
    });
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim();
    if (!token)
        return; // already checked authorization in middleware
    const decoded = jsonwebtoken_1.default.verify(token, "mysecretkey");
    const user_id = decoded.id;
    const { title, content, tags, attachments } = req.body;
    const result = postValidationSchema.safeParse({ title, content, tags, attachments, user_id });
    if (!result.success) {
        res.status(400).json({ message: "Bad Request Invalid format" + result.error });
        return;
    }
    try {
        console.log("logging the data here", result.data);
        const response = yield prisma.post.create({
            data: result.data
        });
        res.status(201).json({ data: response });
    }
    catch (e) {
        res.status(400).json({ error: e });
    }
});
exports.createPost = createPost;
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid post ID" });
        return;
    }
    const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!token) {
        res.status(401).json({ error: "Unauthorized: Missing token" });
        return;
    }
    let user_id;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "mysecretkey");
        user_id = decoded.id;
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
    try {
        const response = yield prisma.post.delete({
            where: {
                id,
                user_id,
            },
        });
        res.json({ message: "Successfully removed post", response });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong while deleting the post" });
        return;
    }
});
exports.deletePostById = deletePostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("BODY :", req.body);
    // Validate and parse token
    const tokenResult = zod_1.z.string().safeParse((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim());
    if (!tokenResult.success) {
        res.status(401).json({ error: "Invalid or missing token" });
        return;
    }
    try {
        // Verify token and extract user ID
        const decoded = jsonwebtoken_1.default.verify(tokenResult.data, "mysecretkey");
        // Validate and parse route parameter ID
        const idResult = zod_1.z.coerce.number().safeParse(req.params.id);
        if (!idResult.success) {
            res.status(400).json({ error: "Invalid post ID" });
            return;
        }
        // Update the post
        const response = yield prisma.post.update({
            where: {
                id: idResult.data,
                user_id: decoded.id, // Ensures user can only update their own posts
            },
            data: req.body, // Updates with request body
        });
        console.log("Post updated successfully:", response);
        res.json({ data: response });
        return;
    }
    catch (e) {
        console.error("Error updating post:", e);
        res.status(500).json({ error: "Something went wrong while updating the post" });
        return;
    }
});
exports.updatePost = updatePost;
