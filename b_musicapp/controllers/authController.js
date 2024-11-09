import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js'
import dotenv from 'dotenv';

dotenv.config();

// Đăng ký user
const registerUser = async (req, res) => {
    let { firstname, lastname, email, password, role } = req.body;
    // validate dữ liệu
    if (!firstname) {
        return res.status(400).send({
            message: "firstname is required"
        });
    } else {
        firstname = firstname.trim();
    }

    if (!lastname) {
        return res.status(400).send({
            message: "lastname is required"
        });
    } else {
        lastname = lastname.trim();
    }

    if (!email) {
        return res.status(400).send({
            message: "email is required"
        });
    } else {
        email = email.trim();
    }

    if (!password) {
        return res.status(400).send({
            message: "password is required"
        });
    } else {
        password = password;
    }

    if (!role) {
        return res.status(400).send({
            message: "role is required"
        });
    } else {
        role = role.trim();
    }
    // Kiểm tra xem email đã tồn tại trong userModel chưa
    const isExistEmail = await userModel.findOne({ email: email }).exec();
    if (isExistEmail) {
        return res.status(400).send({
            message: "Email already exists"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).send({ 
            newUser,
            message: "user created successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Error creating user", error: err.message });
    }
};

// Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    //Validate dữ liệu
    if (!email || !password) {
        return res.status(400).send({
            message: "email and password are required"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // tạo token jwt 
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '9h' });
        //const decodedToken = jwt.decode(token);  // Giải mã token và kiểm tra payload
        //console.log('Decoded Token:', decodedToken);
        res.status(200).send({
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};
const logoutUser = (req, res) => {

    res.status(200).send({
        message: "Logout successful. Please delete the token on client side."
    });
}

export {
    registerUser,
    loginUser,
    logoutUser
}

