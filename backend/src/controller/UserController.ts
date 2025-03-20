import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import jwt, { decode } from 'jsonwebtoken'
import {z} from 'zod'

const prisma  = new PrismaClient()

const validationSchema = z.object({
    firstname : z.string(),
    lastname : z.string(),
    email :  z.coerce.string().email({
     message : "Enter Valid Username"
    }),
    password : z.coerce.string().min(8,{message : "Password Should be Atleast 8 characters long"})
 })

 
export const SignUpController = async (req : Request,res : Response) => {
    const validationResult = validationSchema.safeParse(req.body)
    if(!validationResult.success){
        console.log('validation failed')
        res.status(400).json({message : "Invalid Crendentials" ,
              errors: validationResult.error.format(),})
    return ;
    }
    const {firstname,lastname,user_type,email,password} = req.body
    // create new user and save to database 
   const response = await  prisma.user.create({
        data : {
            firstname,
            lastname,
            user_type,
            email,
            password
        }
    })
    const token = jwt.sign(response,"mysecretkey")
    console.log(response);
    res.json({token: token,payload : response})
}

export const LoginController = async (req : Request,res : Response) => {
    const loginValidationSchema = z.object({
        email : z.string(),
        password : z.string()
    })
    const validationResult = loginValidationSchema.safeParse(req.body)
    if(!validationResult.success){
        res.status(400).json({message : "Invalid Crendentials" ,
              errors: validationResult.error.format(),})
    return ;
    }
    const {email,password} = req.body
    const response = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if(!response){
        res.status(404).json({message : "user not found"})
        return 
    }
    if(response.password != password) {
        res.status(401).json({message : "Invalid User Credentials"})
        return
    }
    const userDetails = response.user_type == "ALUMINI" ? await prisma.alumini.findUnique({
        where : {
            user_id : response.id
        }
    }) : 
    await prisma.student.findUnique({
        where  : {
            user_id : response.id
        }
    })
    const token = jwt.sign(response,"mysecretkey")
    console.log({token : token,payload : {user : response,other : userDetails}});
    res.json({token : token,payload : {user : response,other : userDetails}})

}

export const updateUser = async (req: Request, res: Response) => {
    const token = z.string().safeParse(req.headers['authorization']?.slice(7).trim());

    if (!token.success) {
         res.status(401).json({ message: "Unauthorized: Invalid token" });
         return;
    }

    try {
        const { firstname, lastname, bio, profilePic } = req.body;
        const decoded = jwt.verify(token.data, "mysecretkey") as { id: number,user_type : string };

        if(decoded.user_type == "ALUMINI") {
            const {company,role,experience} = req.body
            const [user,alumini] = await prisma.$transaction([
                prisma.user.update({
                   where : {
                    id : decoded.id
                   },
                   data : {
                    firstname,
                    lastname,
                    bio,
                    profileUrl : profilePic
                   }
                }),
                prisma.alumini.upsert({
                    where: { user_id: decoded.id },
                    update: { company, role, experience },
                    create: { user_id: decoded.id, company, role, experience },
                    select : {
                        company : true,
                        role : true,
                        experience : true
                    }
                })
            ])
            res.status(200).json({ message: "Profile updated successfully", user: {user,other : alumini} });
        }
        else {
            const {university,batch,course} = req.body
            const [user,student] = await prisma.$transaction([
                prisma.user.update({
                   where : {
                    id : decoded.id
                   },
                   data : {
                    firstname,
                    lastname,
                    bio,
                    profileUrl : profilePic
                   }
                }),
                prisma.student.upsert({
                    where: { user_id: decoded.id },
                    update: { university, course, batch },
                    create: { user_id: decoded.id, university, course, batch },
                    select : {
                        university : true,
                        course : true,
                        batch : true
                    }
                })
            ])
            res.status(200).json({ message: "Profile updated successfully", user: {user,other : student} });
        }

        
         return ;
    } catch (error) {
        console.error("Error updating user:", error);
         res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" });
         return ;
    }
};