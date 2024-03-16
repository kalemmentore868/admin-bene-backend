import { Request, Response,NextFunction } from 'express'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
require('dotenv').config();



export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name, wallet_address, role } = req.body;
        console.log(req.body);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with that email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        // Save the new user
        await newUser.save();


        res.status(201).json({ newUser });
    } catch (error) {
        let err:any = ''
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            console.error(error.message)
            err = error.message
            res.status(500).json({ message: 'Error signing up', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
            console.error(err)
            res.status(500).json({ message: 'Error signing up', error: 'An unknown error occurred' });
        }
    }
};

const SECRET_KEY = process.env.SECRET_KEY || ''; 

export const login = async (req: Request, res: Response) => {
    console.log('Attempting Login')
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...userWithoutPassword } = user.toObject();

            // Generate JWT
            const expiresIn = '10h'; // Token expires in 10 hours
            const token = jwt.sign(
                { userId: userWithoutPassword._id, email: userWithoutPassword.email },
                SECRET_KEY,
                { expiresIn }
            );

            // Calculate expiration date
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 10); // Add 10 hours to the current time

            console.log('Logged in and token generated')
            res.json({ user: userWithoutPassword, token, expiresIn: expirationDate.toISOString() });
        } else {
            console.error('invalid email or password')
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in', error: (error as any).message });
    }
};



