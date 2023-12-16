import mongoose, { Schema } from "mongoose";


const user = Schema({
    name: String,
    email: String,
    password: String,
    type: String
})

export default mongoose.model('User', user)