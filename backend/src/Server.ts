import express from 'express'
import { UserRouter } from './routes/UserRoutes'
import {ApiRouter} from './routes/ApiRoutes'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/users',UserRouter)
app.use('/api',ApiRouter)
const PORT : number = 8000
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
})