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
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "investments@benefund.io", // Your email
        pass: "Agreatpassword123$", // Your email password or app-specific password
    },
});
const sendEmail = (emailContent) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "investments@benefund.io",
        to: ["dettomanagement@gmail.com", "thegreatesteverypjackson123@gmail.com"],
        subject: `New contact form submission from ${emailContent.firstName} ${emailContent.lastName}`,
        text: `You have a new submission from ${emailContent.firstName} ${emailContent.lastName}
    wallet address: ${emailContent.walletAddress}
    amount: ${emailContent.amount}
    phone: ${emailContent.phone}
    email: ${emailContent.email}
    `,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendEmail = sendEmail;
const contact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailContent = req.body;
    yield (0, exports.sendEmail)(emailContent);
    res.json({ message: "Contact submission received" });
});
exports.contact = contact;
