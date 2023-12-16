import { Router } from "express";
import { CreateUser, DeleteUser, ReadOwnData, ReadUser } from "../controllers/User.controllers.js";

const router = Router();

router.post('/create-user', CreateUser)
router.delete('/delete-user', DeleteUser)
router.get('/read-user', ReadUser)
router.post('/read-own-data', ReadOwnData)

export default router