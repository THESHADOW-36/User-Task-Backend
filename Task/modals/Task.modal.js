import mongoose, { Schema } from "mongoose";


const task = Schema({
    title: String,
    description: String,
    priority: String,
    dueDate: String,
    completed: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export default mongoose.model('tasks', task)