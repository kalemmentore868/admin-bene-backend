import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || '';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) {
        console.log('Unauthorized')
        return res.sendStatus(401); // If no token, unauthorized
    }
    jwt.verify(token, SECRET_KEY, (err:any, decoded:any) => {
        console.log('Authenticating', SECRET_KEY)
        if (err) {
            console.log(err)
            return res.sendStatus(403); // Invalid token
        }
        // Check if the user's role is admin
        console.log('User role is', decoded?.role);
        if (decoded?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        (req as any).user = decoded;
        next();
    });
};
