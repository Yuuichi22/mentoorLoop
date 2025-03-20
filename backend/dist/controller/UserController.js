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
exports.updateUser = exports.LoginController = exports.SignUpController = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const validationSchema = zod_1.z.object({
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    email: zod_1.z.coerce.string().email({
        message: "Enter Valid Username"
    }),
    password: zod_1.z.coerce.string().min(8, { message: "Password Should be Atleast 8 characters long" })
});
const SignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = validationSchema.safeParse(req.body);
    if (!validationResult.success) {
        console.log('validation failed');
        res.status(400).json({ message: "Invalid Crendentials",
            errors: validationResult.error.format(), });
        return;
    }
    const { firstname, lastname, user_type, email, password } = req.body;
    // create new user and save to database 
    const response = yield prisma.user.create({
        data: {
            firstname,
            lastname,
            user_type,
            email,
            password
        }
    });
    const token = jsonwebtoken_1.default.sign(response, "mysecretkey");
    console.log(response);
    res.json({ token: token, payload: response });
});
exports.SignUpController = SignUpController;
const LoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginValidationSchema = zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string()
    });
    const validationResult = loginValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({ message: "Invalid Crendentials",
            errors: validationResult.error.format(), });
        return;
    }
    const { email, password } = req.body;
    const response = yield prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!response) {
        res.status(404).json({ message: "user not found" });
        return;
    }
    if (response.password != password) {
        res.status(401).json({ message: "Invalid User Credentials" });
        return;
    }
    const userDetails = response.user_type == "ALUMINI" ? yield prisma.alumini.findUnique({
        where: {
            user_id: response.id
        }
    }) :
        yield prisma.student.findUnique({
            where: {
                user_id: response.id
            }
        });
    const token = jsonwebtoken_1.default.sign(response, "mysecretkey");
    console.log({ token: token, payload: { user: response, other: userDetails } });
    res.json({ token: token, payload: { user: response, other: userDetails } });
});
exports.LoginController = LoginController;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = zod_1.z.string().safeParse((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.slice(7).trim());
    if (!token.success) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return;
    }
    try {
        const { firstname, lastname, bio, profilePic } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token.data, "mysecretkey");
        if (decoded.user_type == "ALUMINI") {
            const { company, role, experience } = req.body;
            const [user, alumini] = yield prisma.$transaction([
                prisma.user.update({
                    where: {
                        id: decoded.id
                    },
                    data: {
                        firstname,
                        lastname,
                        bio,
                        profileUrl: profilePic
                    }
                }),
                prisma.alumini.upsert({
                    where: { user_id: decoded.id },
                    update: { company, role, experience },
                    create: { user_id: decoded.id, company, role, experience },
                    select: {
                        company: true,
                        role: true,
                        experience: true
                    }
                })
            ]);
            res.status(200).json({ message: "Profile updated successfully", user: { user, other: alumini } });
        }
        else {
            const { university, batch, course } = req.body;
            const [user, student] = yield prisma.$transaction([
                prisma.user.update({
                    where: {
                        id: decoded.id
                    },
                    data: {
                        firstname,
                        lastname,
                        bio,
                        profileUrl: profilePic
                    }
                }),
                prisma.student.upsert({
                    where: { user_id: decoded.id },
                    update: { university, course, batch },
                    create: { user_id: decoded.id, university, course, batch },
                    select: {
                        university: true,
                        course: true,
                        batch: true
                    }
                })
            ]);
            res.status(200).json({ message: "Profile updated successfully", user: { user, other: student } });
        }
        return;
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" });
        return;
    }
});
exports.updateUser = updateUser;
