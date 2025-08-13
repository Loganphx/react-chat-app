import User from "../models/user.model.js";
import {generateToken} from "../lib/jwt.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    console.log("signup")
    const {fullName, email, password} = req.body;
   try {
       if(!fullName || !email || !password) {
           return res.status(400).send({error: "All fields are required"});
       }
       if(password.length < 6) {
           return res.status(400).json({message: "Password must be atleast 6 characters"});
       }

       const user = await User.findOne({email})

       if(user) return res.status(400).json({message: "Email already exists"});

       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
       const newUser =new User({
           fullName: fullName,
           email: email,
           password: hashedPassword,
       })

       if(newUser) {
           generateToken(newUser._id, res);
           await newUser.save();

           res.status(201).json({
               _id:newUser._id,
               fullName: newUser.fullName,
               email: newUser.email,
               profilePictureUrl: newUser.profilePictureUrl,
           })
       } else {
           return res.status(401).json({message: "Invalid user data"});
       }
   } catch (e) {
       console.error('Error occured', e);
       return res.status(500).json({message: "Internal Server Error"});
   }
};

export const login = async (req, res) => {
   console.log("login")
   const {email, password} = req.body;
   try {
       const user = await User.findOne({email});

       if(!user) {
           return res.status(401).json({message: "Invalid email or password"});
       }

       const isPasswordCorrect = await bcrypt.compare(password, user.password);
       if(!isPasswordCorrect) {
           return res.status(401).json({message: "Invalid email or password"});
       }

       generateToken(user._id, res);

       return res.status(200).json({
           _id:user._id,
           fullName: user.fullName,
           email: user.email,
           profilePictureUrl: user.profilePictureUrl
       })
   } catch (error) {
       console.log(error);
       return res.status(500).json({message: "Internal Server Error"});
   }
};
export const logout = (req, res) => {
    console.log("logout")
    try{
        res.cookie('token', "", {maxAge: 0});
        return res.status(200).json({message: "Logged out"});
    } catch(error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile = async (req, res) => {
    console.log("updateProfile");
    try {
        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const profilePic = req.files.avatar;
        console.log(profilePic)
        const userId = req.user._id;


        if(!profilePic) {
            return res.status(401).json({message: "Invalid profile picture"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic.tempFilePath)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePictureUrl: uploadResponse.secure_url}, {new: true})

        return res.status(200).json(updatedUser);
    } catch(error) {
        console.error("Error in uploader controller", error.message);
        return res.status(500).json({message: `Internal Server Error: ${error.message}`});
    }
}

export const checkAuth = async (req, res) => {
    console.log("checkAuth");
    return res.status(200).json(req.user);

    try {
    } catch(error) {
        console.error("Error in checkAuth controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}