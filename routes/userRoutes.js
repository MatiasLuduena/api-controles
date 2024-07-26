import express from "express";
const routes = express.Router();

import {
    getAuthentication,
    registerUser,
    loginUser
} from "../controllers/userControllers.js";

routes.get("/get/auth", getAuthentication);

routes.post("/post/register-user", registerUser);

routes.post("/post/login-user", loginUser);

export default routes;