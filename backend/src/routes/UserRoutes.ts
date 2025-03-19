import express from 'express'
import { SignUpController,LoginController, updateUser } from '../controller/UserController'
import { checkAuthorization } from '../middlewares/AuthorizationMiddleware'
export const UserRouter = express.Router()

UserRouter.post('/sign-up',SignUpController)
UserRouter.post('/login',LoginController)
UserRouter.post('/update-user',checkAuthorization,updateUser)