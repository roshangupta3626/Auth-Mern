import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

