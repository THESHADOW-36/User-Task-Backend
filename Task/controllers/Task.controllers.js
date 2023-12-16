import TaskModal from "../modals/Task.modal.js"
import UserModal from "../modals/User.modal.js"




export const CreateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, adminId } = req.body
        if (!title || !description || !priority || !dueDate || !adminId) return res.status(401).json({ success: false, message: "All fields are mandatory" })

        const isAdmin = await UserModal.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Not a admin" })

        const newTask = new TaskModal({ title, description, priority, dueDate })
        await newTask.save();

        return res.status(201).json({ success: true, newTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const UpdateTask = async (req, res) => {
    try {
        const { id, title, description, priority, dueDate, adminId } = req.body
        if (!id || !title || !description || !priority || !dueDate || !adminId) return res.status(401).json({ success: false, message: "All fields are mandatory" })

        const isAdmin = await UserModal.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Not a admin" })

        const updatedTask = await TaskModal.findByIdAndUpdate(id, { title, description, priority, dueDate }, { new: true })

        res.status(201).json({ success: true, updatedTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const SortSearch = async (req, res) => {
    try {
        const { adminId, searchQuery, sortBy } = req.body;

        const isAdmin = await UserModal.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Admin not found" })

        const query = {};
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        let sort = {};
        switch (sortBy) {
            case 'completionStatus':
                sort.completed = 1;
                break;
            case 'dueDate':
                sort.dueDate = 1;
                break;
            case 'priority':
                sort.priority = 1;
                break;
            default:
                sort.createdAt = -1;
                break;
        }

        const tasks = await TaskModal.find(query).sort(sort);

        res.status(201).json({ success: true, tasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const ReadOwnTasks = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModal.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const userTasks = await TaskModal.find({ userId: userId });

        res.status(201).json({ success: true, userTasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const AssignTaskToUser = async (req, res) => {
    try {
        const { adminId, taskId, assignedUserId } = req.body;

        const isAdmin = await UserModal.findOne({ _id: adminId, type: "admin" });
        if (!isAdmin) {
            return res.status(401).json({ error: "Admin not found." });
        }

        const task = await TaskModal.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }

        const assignedUser = await UserModal.findById(assignedUserId);
        if (!assignedUser) {
            return res.status(404).json({ error: "Assigned user not found." });
        }

        TaskModal.userId = assignedUserId;
        await task.save();

        res.status(201).json({ success: true, task });

    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const CompleteTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;
        if (!taskId || !userId) {
            return res.status(400).json({ error: 'Invalid request. Both taskId and userId are required.' });
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { completed: true },
            { new: true, useFindAndModify: false }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'User not belong to task or Task not found' });
        }

        const completedTaskEvent = {
            eventType: 'TASK_COMPLETED',
            taskId: taskId,
            userId: userId,
            completedAt: new Date().toISOString()
        };
        try {
            await publishEvent('TASK_COMPLETED', JSON.stringify(completedTaskEvent));
        } catch (error) {
            console.error('Error publishing event:', error);
        }
        res.status(201).json({ success: true, message: 'Task marked as complete', task: updatedTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}