import express from "express";
import { checkAuthorization } from "../middlewares/AuthorizationMiddleware";
import { getAllPosts, getPostById, createPost, deletePostById, getAllPostsOfUser, updatePost } from "../controller/PostController";
import { createProject, deleteProjectById, getAllProjects, getAllProjectsOfUser, getProjectById } from "../controller/ProjectController";
import { getAllBidsOfUser, placeBid, removeBidById } from "../controller/BidController";
import { updateUser } from "../controller/UserController";

export const ApiRouter = express.Router();

// Post routes
ApiRouter.get('/posts', checkAuthorization, getAllPosts);
ApiRouter.get('/me/posts', checkAuthorization, getAllPostsOfUser);
ApiRouter.get('/posts/:id', checkAuthorization, getPostById);
ApiRouter.post('/posts/create-post', checkAuthorization, createPost);
ApiRouter.delete('/posts/:id', checkAuthorization, deletePostById);
ApiRouter.put('/posts/:id', checkAuthorization, updatePost);
// Project routes
ApiRouter.get('/projects', checkAuthorization, getAllProjects);
ApiRouter.get('/projects/:id', checkAuthorization, getProjectById);
ApiRouter.get('/me/projects', checkAuthorization, getAllProjectsOfUser);
ApiRouter.post('/projects/create-project', checkAuthorization, createProject); // Fixed naming
ApiRouter.delete('/projects/:id', checkAuthorization, deleteProjectById);
// Bid routes
ApiRouter.post('/bids/place-bid', checkAuthorization, placeBid); // Added bid creation route
ApiRouter.get('bids/:id',checkAuthorization,removeBidById)
ApiRouter.get('/bids',checkAuthorization,getAllBidsOfUser)