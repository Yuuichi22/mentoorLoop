import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client"
import {z} from 'zod' 
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
export const placeBid = async (req :Request,res : Response) => {
    const bidValidationSchema = z.object({
       project_id : z.coerce.number(),
       user_id : z.coerce.number()
    })
    const {project_id} = req.body;
    const token: string | undefined = req.headers['authorization']?.slice(7).trim();
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return ;
   }
    const payload = jwt.verify(token,"mysecretkey") as {id : number}
    const user_id = payload.id
    console.log(req.body)
    const result = bidValidationSchema.safeParse({project_id,user_id})
    if(!result.success) {
        console.log('ran here')
        res.status(
            400
        ).json({message : "Invalid foramt",errors : result.error})
        return ;
    }
    try{
        const response = await prisma.bidder.create({
            data : result.data
        })
        res.status(201).json({message : "bid created succesully" , data : response})
    }
    catch(e) {
        res.status(400).json({error : e})
    }

}


export const removeBidById = async (req : Request,res : Response) => {
    const  id :number  = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid Bid ID" });
        return ;
   }
   const token: string | undefined = req.headers['authorization']?.slice(7).trim();
   if (!token) {
       res.status(401).json({ message: 'Unauthorized: No token provided' });
       return ;
  }
   const payload = jwt.verify(token,"mysecretkey") as {id : number}
   const user_id = payload.id
   console.log('hre re')
    try{
        const response = await prisma.bidder.delete({
            where : {
                id,
                user_id
            }
        })
        console.log("removed : ",response)
        res.json({message : "successfully removed bid",response})
    }
    catch(e) {
        res.status(500).json({error : e})
    }
}


export const getAllBidsOfUser = async (req: Request, res: Response) => {
    const token: string | undefined = req.headers['authorization']?.slice(7).trim();

    try {
        // Check if the token exists
        if (!token) {
             res.status(401).json({ message: 'Unauthorized: No token provided' });
             return ;
        }

        // Verify the token
        const payload = jwt.verify(token, "mysecretkey") as { id: number }; // Ensure payload has the correct type

        // Fetch bids for the user
        const bids = await prisma.bidder.findMany({
            where: {
                user_id: payload.id,
            },
            include: {
                project: true, // Include project details (if applicable)
            },
        });
        console.log("bids of user : ",bids)
        // Return the bids as a response
        res.status(200).json(bids);
    } catch (e) {
        console.error('Error in getAllBidsOfUser:', e);

        // Handle specific JWT errors
        if (e instanceof jwt.JsonWebTokenError) {
             res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Handle other errors
        res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
    }
};