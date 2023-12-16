import { Router } from "express";
import { AssignTaskToUser, CompleteTask, CreateTask, ReadOwnTasks, SortSearch, UpdateTask } from "../controllers/Task.controllers.js";

const router = Router();

router.post('/createTask', CreateTask);
router.post('/updateTask', UpdateTask);
router.post('/sortSearch', SortSearch)
router.post('/readOwnTasks', ReadOwnTasks);
// router.post('/markTaskAsComplete', MarkTaskAsComplete);
router.post('/assignTaskToUser', AssignTaskToUser);
router.post('/tasks/complete', CompleteTask);

export default router