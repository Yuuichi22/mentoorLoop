import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {z} from 'zod'
import  jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const response = await prisma.post.findMany({
            select : {
                id : true,
                title : true,
                content : true,
                user : true
            }
        });
        res.json({ posts: response });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" ,error});
    }
};
export const getAllPostsOfUser = async (req : Request,res : Response) => {
    try {
        const token = z.string().safeParse(req.headers['authorization']?.slice(7).trim());
        if(token.success) {
            const decoded = jwt.verify(token.data,"mysecretkey") as {id : number}
            const response = await prisma.post.findMany({
                where : {
                    user_id : decoded.id
                }
            })
            res.json({data : response})
        }
        else {
                res.status(400).json({message : "INVALID JWT"})
        }
    }
    catch(e) {
        res.status(500).json({error : {
            message : e
        }})
    }
}
export const getPostById = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
             res.status(400).json({ error: "Invalid post ID" });
             return ;
        }

        const response = await prisma.post.findUnique({
            where: { id }
        });

        if (!response) {
             res.status(404).json({ error: "Post not found" });
             return ;
        }

        res.json({ post: response });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch post" });
    }
};


export const createPost = async (req : Request,res : Response) => {
    
    const postValidationSchema = z.object({
        title : z.string(),
        content : z.string(),
        tags : z.array(z.string()),
        attachments : z.array(z.string()),
        user_id : z.coerce.number(),
    })
    const token = req.headers['authorization']?.slice(7).trim()
    if(!token) return ; // already checked authorization in middleware
    const decoded = jwt.verify(token,"mysecretkey") as {id : number}
    const user_id = decoded.id
    const {title,content,tags,attachments}  = req.body;
    const result = postValidationSchema.safeParse({title,content,tags,attachments,user_id})
    if(!result.success) {
        res.status(400).json({message : "Bad Request Invalid format" + result.error})
        return ;
    }
    try{
        console.log("logging the data here",result.data)
    const response  = await prisma.post.create({
        data :  result.data
    }) 
    res.status(201).json({data : response})
}
    catch(e) {
        res.status(400).json({error : e})
    }

}
export const deletePostById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
         res.status(400).json({ error: "Invalid post ID" });
         return ;
    }

    const token = req.headers.authorization?.split("Bearer ")[1]?.trim();
    if (!token) {
         res.status(401).json({ error: "Unauthorized: Missing token" });
         return;
    }

    let user_id: number;
    try {
        const decoded = jwt.verify(token, "mysecretkey") as { id: number };
        user_id = decoded.id;
    } catch (error) {
         res.status(401).json({ error: "Unauthorized: Invalid token" });
         return ;
    }

    try {
        const response = await prisma.post.delete({
            where: {
                id,
                user_id,
            },
        });

         res.json({ message: "Successfully removed post", response });
         return ;
    } catch (error) {
         res.status(500).json({ error: "Something went wrong while deleting the post" });
         return ;
    }
};


export const updatePost = async (req: Request, res: Response) => {
    console.log("BODY :",req.body);
    
    // Validate and parse token
    const tokenResult = z.string().safeParse(req.headers['authorization']?.slice(7).trim());
    if (!tokenResult.success) {
         res.status(401).json({ error: "Invalid or missing token" });
         return ;
    }

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(tokenResult.data, "mysecretkey") as { id: number };
        
        // Validate and parse route parameter ID
        const idResult = z.coerce.number().safeParse(req.params.id);
        if (!idResult.success) {
             res.status(400).json({ error: "Invalid post ID" });
             return ;
        }

        // Update the post
        const response = await prisma.post.update({
            where: {
                id: idResult.data,
                user_id: decoded.id, // Ensures user can only update their own posts
            },
            data: req.body, // Updates with request body
        });

        console.log("Post updated successfully:", response);
        res.json({ data: response });
        return ;
    } catch (e) {
        console.error("Error updating post:", e);
        res.status(500).json({ error: "Something went wrong while updating the post" });
        return ;
    }
};
