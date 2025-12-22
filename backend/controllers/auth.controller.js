import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Company from "../models/Company.model.js";
import { slugify } from "../utils/slugify.js";
const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}
export const signup = async (req, res) => {
    const { email, password, companyName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
        name: companyName,
        slug: slugify(companyName)
    })

    const user = await User.create({
        email,
        password: hashedPassword,
        companyId: company._id
    })

    const token = createToken({
        userId: user._id,
        companyId: company._id
    })


    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // ✅ REQUIRED for HTTPS
        sameSite: "none",      // ✅ REQUIRED for cross-domain
    }).status(201).json({
        message: "Signup successful"
    })
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken({
        userId: user._id,
        companyId: user.companyId
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // ✅ REQUIRED for HTTPS
        sameSite: "none",      // ✅ REQUIRED for cross-domain
    }).json({ message: "Login successful" });
};

export const logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out" });
}