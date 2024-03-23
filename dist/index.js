"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const investmentsRoutes_1 = __importDefault(require("./routes/investmentsRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 3002;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/investments', investmentsRoutes_1.default);
const mongoURI = process.env.mongoURI;
if (!mongoURI) {
    throw new Error('The MONGO_URI environment variable is not defined.');
}
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
// Express middleware and routes here
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
