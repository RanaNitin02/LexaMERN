import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookie from 'express-session/session/cookie.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(cors);


app.get('/', (req,res)=>{
    res.send("API is working")
}) 

app.use("/api/v1/auth", authRouter);

app.listen(port,() => {
    connectDB();
    console.log(`Server started at ${port}...`);
})