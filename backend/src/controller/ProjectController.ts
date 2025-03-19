
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { decode } from 'jsonwebtoken'
import {z} from 'zod'
const prisma = new PrismaClient();

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const response = await prisma.project.findMany({
            include : {
                user : true
            }
        });
        res.json({ projects: response });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
             res.status(400).json({ error: "Invalid project ID" });
             return ;
        }

        const response = await prisma.project.findUnique({
            where: { id }
        });

        if (!response) {
             res.status(404).json({ error: "project not found" });
             return ;
        }

        res.json({ project: response });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch project" });
    }
};


export const createProject = async (req : Request,res : Response) => {
    
    const projectValidationSchema = z.object({
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
    const result = projectValidationSchema.safeParse({title,content,tags,attachments,user_id})
    if(!result.success) {
        res.status(400).json({message : "Bad Request Invalid format" + result.error})
        return ;
    }
    try{
    const response  = await prisma.project.create({
        data :  result.data
    }) 
    res.status(201).json({data : response})
}
    catch(e) {
        res.status(400).json({error : e})
    }

}


export const deleteProjectById = async (req : Request,res: Response) =>{
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid project ID" });
        return ;
   }
   const token = req.headers['authorization']?.slice(7).trim()
   if(!token) return ; // already checked authorization in middleware
   const decoded = jwt.verify(token,"mysecretkey") as {id : number}
   try{
    const response = await  prisma.project.delete({
        where : {
            id,
            user_id : decoded.id
        }
    })
    res.json({message : "successfully removed Project",response})
}
catch(e) {
    res.status(500).json({error : e})
}
}

export const getAllProjectsOfUser = async (req : Request,res : Response) => {
    try {
        const token = z.string().safeParse(req.headers['authorization']?.slice(7).trim());
        if(token.success) {
            const decoded = jwt.verify(token.data,"mysecretkey") as {id : number}
            const response = await prisma.project.findMany({
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