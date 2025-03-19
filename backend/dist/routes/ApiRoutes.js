"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const PostController_1 = require("../controller/PostController");
const ProjectController_1 = require("../controller/ProjectController");
const BidController_1 = require("../controller/BidController");
exports.ApiRouter = express_1.default.Router();
// Post routes
exports.ApiRouter.get('/posts', AuthorizationMiddleware_1.checkAuthorization, PostController_1.getAllPosts);
exports.ApiRouter.get('/me/posts', AuthorizationMiddleware_1.checkAuthorization, PostController_1.getAllPostsOfUser);
exports.ApiRouter.get('/posts/:id', AuthorizationMiddleware_1.checkAuthorization, PostController_1.getPostById);
exports.ApiRouter.post('/posts/create-post', AuthorizationMiddleware_1.checkAuthorization, PostController_1.createPost);
exports.ApiRouter.delete('/posts/:id', AuthorizationMiddleware_1.checkAuthorization, PostController_1.deletePostById);
exports.ApiRouter.put('/posts/:id', AuthorizationMiddleware_1.checkAuthorization, PostController_1.updatePost);
// Project routes
exports.ApiRouter.get('/projects', AuthorizationMiddleware_1.checkAuthorization, ProjectController_1.getAllProjects);
exports.ApiRouter.get('/projects/:id', AuthorizationMiddleware_1.checkAuthorization, ProjectController_1.getProjectById);
exports.ApiRouter.get('/me/projects', AuthorizationMiddleware_1.checkAuthorization, ProjectController_1.getAllProjectsOfUser);
exports.ApiRouter.post('/projects/create-project', AuthorizationMiddleware_1.checkAuthorization, ProjectController_1.createProject); // Fixed naming
exports.ApiRouter.delete('/projects/:id', AuthorizationMiddleware_1.checkAuthorization, ProjectController_1.deleteProjectById);
// Bid routes
exports.ApiRouter.post('/bids/place-bid', AuthorizationMiddleware_1.checkAuthorization, BidController_1.placeBid); // Added bid creation route
exports.ApiRouter.delete('/bids/:id', AuthorizationMiddleware_1.checkAuthorization, BidController_1.removeBidById);
exports.ApiRouter.get('/bids', AuthorizationMiddleware_1.checkAuthorization, BidController_1.getAllBidsOfUser);
