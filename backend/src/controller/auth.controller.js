import { z } from "zod";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const login = async (req, res, next) => {
  const loginSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(6, { message: `password must be atleast 6 character long` })
      .max(20, { message: `password max length is 20 character` }),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  try {
    const { email, password } = result.data;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Unauthorized,Wrong credentials");
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Unauthorized,Wrong credentials");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      msg: `user login successfully`,
      token
    });
  } catch (error) {
    return next(error)
  }
};

export const signup = async (req, res, next) => {
  const signupSchema = z.object({
    username: z
      .string()
      .min(6, { message: `username must be atleast 6 character long` })
      .max(20, { message: `username max length is 20 character` })
      .trim(),

    email: z.string().email({ message: `email format is invalid` }).trim().toLowerCase(),

    password: z
      .string()
      .min(6, { message: `password must be atleast 6 character long` })
      .max(20, { message: `password max length is 20 character` })
      .regex(/[a-z]/, { message: "Must include lowercase" })
      .regex(/[A-Z]/, { message: "Must include uppercase" })
      .regex(/[^a-zA-Z0-9]/, { message: "Must include special char" }),
  });

  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  try {
    const { username, email, password } = result.data;

    const userExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      const error = new Error("User already Exist");
      error.statusCode = 409;
      return next(error);
    }

    const lowercaseEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email: lowercaseEmail,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      msg: `user signup successfully`,
    });
  } catch (error) {
    return next(error);
  }
};

export const fetchUser = async (req,res,next) => {
    const userId = req.userId
    try {
      if(!mongoose.Types.ObjectId.isValid(userId)){
        const error = new Error("invalid user id")
        error.statusCode = 400
        return next(error)
      }
      const user = await User.findById(userId).select("-password")
      if(!user){
        const error = new Error("User not found")
        error.statusCode = 404
        return next(error)
      }

      return res.status(200).json({
        msg : `User data successfully retrieve`,
        data : user
      })

    } catch (error) {
       return next(error)
    }
};
