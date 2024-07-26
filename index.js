// imports
import express from "express"
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";

// routes imports
import usersRoutes from "./routes/userRoutes.js";

// methods
const app = express();
dotenv.config();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB
mongoose.connect(process.env.MONGO_DB_URI)
.then(() => {
    console.log('MongoDB working correctly');
})
.catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
});

// routes
app.use("/api/users", usersRoutes);

// init server
const port = process.env.PORT;
app.listen(port, () => console.log(`The server is start in port ${port}`));