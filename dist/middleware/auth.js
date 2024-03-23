"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || '';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) {
        console.log('Unauthorized');
        return res.sendStatus(401); // If no token, unauthorized
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        console.log('Authenticating', SECRET_KEY);
        if (err) {
            console.log(err);
            return res.sendStatus(403); // Invalid token
        }
        // Check if the user's role is admin
        console.log('User role is', decoded === null || decoded === void 0 ? void 0 : decoded.role);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
