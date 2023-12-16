import { Router } from "express";
import TaskRoutes from "./Task.Routes.js"

const router = Router();

router.use('/task', TaskRoutes)

export default router