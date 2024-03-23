"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
require("dotenv").config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, first_name, last_name, wallet_address, gender, role } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already exists with that email" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new User_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        // Save the new user
        yield newUser.save();
        res.status(201).json({ newUser });
    }
    catch (error) {
        let err = "";
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            console.error(error.message);
            err = error.message;
            res
                .status(500)
                .json({ message: "Error signing up", error: error.message });
        }
        else {
            // If the caught error is not an Error object, handle it here
            console.error(err);
            res.status(500).json({
                message: "Error signing up",
                error: "An unknown error occurred",
            });
        }
    }
});
exports.signup = signup;
const SECRET_KEY = process.env.SECRET_KEY || "";
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Attempting Login");
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            // Generate JWT
            const expiresIn = "10h"; // Token expires in 10 hours
            const token = jsonwebtoken_1.default.sign({ userId: userWithoutPassword._id, email: userWithoutPassword.email }, SECRET_KEY, { expiresIn });
            // Calculate expiration date
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 10); // Add 10 hours to the current time
            console.log("Logged in", Object.assign({}, userWithoutPassword));
            res.json({
                data: Object.assign({}, userWithoutPassword),
                expirationDate: expirationDate.getTime(), // Send expiry date back to the client
            });
        }
        else {
            console.error("invalid email or password");
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Error logging in", error: error.message });
    }
});
exports.login = login;
