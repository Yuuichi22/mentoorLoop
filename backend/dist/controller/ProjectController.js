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
exports.getAllProjectsOfUser = exports.deleteProjectById = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.project.findMany({
            include: {
                user: true
            }
        });
        res.json({ projects: response });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});
exports.getAllProjects = getAllProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid project ID" });
            return;
        }
        const response = yield prisma.project.findUnique({
            where: { id }
        });
        if (!response) {
            res.status(404).json({ error: "project not found" });
            return;
        }
        res.json({ project: response });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch project" });
    }
});
exports.getProjectById = getProjectById;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const projectValidationSchema = zod_1.z.object({
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
    const result = projectValidationSchema.safeParse({ title, content, tags, attachments, user_id });
    if (!result.success) {
        res.status(400).json({ message: "Bad Request Invalid format" + result.error });
        return;
    }
    try {
        const response = yield prisma.project.create({
            data: result.data
        });
        res.status(201).json({ data: response });
    }
    catch (e) {
        res.status(400).json({ error: e });
    }
});
exports.createProject = createProject;
const deleteProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid project ID" });
        return;
    }
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim();
    if (!token)
        return; // already checked authorization in middleware
    const decoded = jsonwebtoken_1.default.verify(token, "mysecretkey");
    try {
        const response = yield prisma.project.delete({
            where: {
                id,
                user_id: decoded.id
            }
        });
        res.json({ message: "successfully removed Project", response });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
exports.deleteProjectById = deleteProjectById;
const getAllProjectsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = zod_1.z.string().safeParse((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim());
        if (token.success) {
            const decoded = jsonwebtoken_1.default.verify(token.data, "mysecretkey");
            const response = yield prisma.project.findMany({
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
exports.getAllProjectsOfUser = getAllProjectsOfUser;
