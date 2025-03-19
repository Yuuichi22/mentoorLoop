import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
export const checkAuthorization = async (req : Request,res : Response,next : NextFunction) => {
        const authToken : string | undefined  = req.headers['authorization']
        if(!authToken || !authToken.startsWith('Bearer ')){
            console.log("From checkAuth middlware");
            res.json({message : "Invalid json token"})
            return ;
        }
        const token = authToken.slice(7).trim()
        try{
            const decode =await jwt.verify(token,"mysecretkey")
            console.log("decoded data  : ", decode)
            console.log(token)
            
        next()
        }
        catch(e){
            console.log("From checkAuth middlware Exception");

            res.json({message : e})
            return 
        }
}