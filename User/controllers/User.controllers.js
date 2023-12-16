import UserModal from "../modals/User.modal.js";

export const CreateUser = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;
        if (!name || !email || !password || !type) return res.status(401).json({ success: false, message: "All fields are mandatory" })

        const user = new UserModal({ name, email, password, type })

        await user.save();

        return res.status(200).json({ success: true, message: "Registered Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}


export const DeleteUser = async (req, res) => {
    try {
        const { id, adminId } = req.body;
        if (!id || !adminId) return res.status(401).json({ success: false, message: "User and admin id not found" })

        const user = await UserModal.findOne({ _id: adminId, type: "admin" })
        if (!user) return res.status(401).json({ success: false, error: "Admin is not valid." })

        await UserModal.findByIdAndDelete(id)

        res.status(201).json("User deleted successfully.");
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}


export const ReadUser = async (req, res) => {
    try {
        const user = await UserModal.find();
        return res.status(200).json({ success: true, user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}


export const ReadOwnData = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(404).json({ success: false, message: "No User ID" })

        const user = await UserModal.findById(id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });

        return res.status(200).json({ success: true, user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}