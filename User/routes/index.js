import { Router } from "express";
import userRoutes from "./User.routes.js"

const router = Router();

router.use('/user', userRoutes)

export default router