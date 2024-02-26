import { Request, Response } from 'express'
import bcrypt from 'bcryptjs';
import User from '../models/User';



export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name, wallet_address } = req.body;
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
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            res.status(500).json({ message: 'Error signing up', error: error.message });
        } else {
            // If the caught error is not an Error object, handle it here
            res.status(500).json({ message: 'Error signing up', error: 'An unknown error occurred' });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
          // Exclude password field from user object
          const { password: userPassword, ...userWithoutPassword } = user.toObject();
          res.json({ user: userWithoutPassword });
      } else {
          res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      if (error instanceof Error) {
          // Now TypeScript knows that error is an Error object
          res.status(500).json({ message: 'Error logging in', error: error.message });
      } else {
          // If the caught error is not an Error object, handle it here
          res.status(500).json({ message: 'Error logging in', error: 'Error logging in' });
      }
    }
  };