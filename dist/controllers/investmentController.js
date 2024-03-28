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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaxSlot = exports.updateProSlot = exports.updateLiteSlot = exports.getMaxSlot = exports.getProSlot = exports.getLiteSlot = exports.update = exports.createInvestment = exports.getInvestmentsByUserId = exports.getAllInvestments = exports.getUsdtToPounds = exports.getEthereumPrice = void 0;
const Investment_1 = __importDefault(require("../models/Investment"));
const User_1 = __importDefault(require("../models/User"));
const LiteSlot_1 = __importDefault(require("../models/LiteSlot"));
const axios_1 = __importDefault(require("axios"));
const ProSlot_1 = __importDefault(require("../models/ProSlot"));
const MaxSlot_1 = __importDefault(require("../models/MaxSlot"));
const getEthereumPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = process.env.cmcAPIKEY; // Replace 'YOUR_API_KEY' with your actual CoinMarketCap API key
        const response = yield axios_1.default.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD', {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Access-Control-Allow-Origin': '*' // Set CORS header
            }
        });
        const ethereumPrice = response.data.data.ETH.quote.USD.price;
        console.log(ethereumPrice, 'is price');
        res.json({ ethereumPrice });
    }
    catch (error) {
        console.error('Error fetching Ethereum price:', error);
        res.status(500).json({ error: 'Error fetching Ethereum price' });
    }
});
exports.getEthereumPrice = getEthereumPrice;
const getUsdtToPounds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = process.env.cmcAPIKEY; // Replace 'YOUR_API_KEY' with your actual CoinMarketCap API key
        const response = yield axios_1.default.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDT&convert=GBP', {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Access-Control-Allow-Origin': '*' // Set CORS header
            }
        });
        const usdtToPoundsRate = response.data.data.USDT.quote.GBP.price;
        console.log(usdtToPoundsRate, 'is the pounds rate');
        res.json({ usdtToPoundsRate });
    }
    catch (error) {
        console.error('Error fetching USDT to pounds rate:', error);
        res.status(500).json({ error: 'Error fetching USDT to pounds rate' });
    }
});
exports.getUsdtToPounds = getUsdtToPounds;
const getAllInvestments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const investments = yield Investment_1.default.find().populate({
            path: 'user_id',
            select: '-password' // Exclude the password field
        });
        res.json(investments);
    }
    catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            console.log(error);
            res.status(500).json({ message: 'Error Getting Investments', error: error.message });
        }
        else {
            // If the caught error is not an Error object, handle it here
            console.log('An unknown error occurred');
            res.status(500).json({ message: 'Error Getting Investments', error: 'An unknown error occurred' });
        }
    }
});
exports.getAllInvestments = getAllInvestments;
const getInvestmentsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        // Find investments by user ID and populate user data excluding the password field
        const investments = yield Investment_1.default.find({ user_id: userId }).populate({
            path: 'user_id',
            select: '-password'
        });
        if (!investments) {
            return res.status(404).json({ message: 'No investments found for the user' });
        }
        console.log(investments, ' is user investments');
        res.json(investments);
    }
    catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is an Error object
            res.status(500).json({ message: 'Error Getting Investment', error: error.message });
        }
        else {
            // If the caught error is not an Error object, handle it here
            res.status(500).json({ message: 'Error Getting Investment', error: 'An unknown error occurred' });
        }
    }
});
exports.getInvestmentsByUserId = getInvestmentsByUserId;
const createInvestment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email from the request body
        const { email, initial_investment, total_return, imo_deposit_amount } = req.body;
        // Check if the user exists based on the provided email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            console.log('User not found for the provided email');
            return res.status(404).json({ message: 'User not found for the provided email' });
        }
        // Retrieve the user_id
        const user_id = user._id;
        // Find the current balance for this user in the investment model
        const currentInvestment = yield Investment_1.default.findOne({ email });
        // Calculate the new balance by adding the imo_deposit_amount to the current balance
        const newBalance = currentInvestment ? currentInvestment.balance + imo_deposit_amount : imo_deposit_amount;
        // Create the investment with the retrieved user_id and updated balance
        const investment = new Investment_1.default({
            user_id,
            initial_investment,
            total_return,
            imo_deposit_amount,
            balance: newBalance
        });
        const savedInvestment = yield investment.save();
        console.log('Created investment for user');
        // // Set a timer to update the investment status after 1 hour
        // setTimeout(async () => {
        //     try {
        //         const updatedInvestment = await Investment.findByIdAndUpdate(savedInvestment._id, { status: 'Withdraw Funds' }, { new: true });
        //     } catch (updateError) {
        //         console.error(`Error updating investment ${savedInvestment._id} to 'Withdraw Funds':`, updateError);
        //     }
        // }, 10000); // 1 hour in milliseconds
        res.status(201).json(savedInvestment);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ message: 'Error Creating Investment', error: error.message });
        }
        else {
            console.log('An unknown error occurred');
            res.status(500).json({ message: 'Error Creating Investment', error: 'An unknown error occurred' });
        }
    }
});
exports.createInvestment = createInvestment;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const investmentId = req.params.id;
    const fieldsToUpdate = {};
    // Check each possible field to see if it was provided in the request body
    const { initial_investment, total_return, imo_deposit_amount, createdAt, status, } = req.body;
    if (initial_investment !== undefined)
        fieldsToUpdate["initial_investment"] = initial_investment;
    if (total_return !== undefined)
        fieldsToUpdate["total_return"] = total_return;
    if (imo_deposit_amount !== undefined)
        fieldsToUpdate["imo_deposit_amount"] = imo_deposit_amount;
    if (createdAt !== undefined)
        fieldsToUpdate["createdAt"] = createdAt;
    if (status !== undefined)
        fieldsToUpdate["status"] = status;
    try {
        const updatedInvestment = yield Investment_1.default.findByIdAndUpdate(investmentId, { $set: fieldsToUpdate }, { new: true, runValidators: true });
        if (!updatedInvestment) {
            return res.status(404).json({ message: "Investment not found" });
        }
        res.json({ message: "Investment updated successfully", updatedInvestment });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ message: 'Error Updating Investment', error: error.message });
        }
        else {
            console.log('An unknown error occurred');
            res.status(500).json({ message: 'Error Updating Investment', error: 'An unknown error occurred' });
        }
    }
});
exports.update = update;
const getLiteSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liteSlot = yield LiteSlot_1.default.findById('6604e5f0c9e56d02de212b8e').select('slot');
        console.log(liteSlot === null || liteSlot === void 0 ? void 0 : liteSlot.slot);
        return !liteSlot
            ? res.status(404).json({ message: "Slot not found" })
            : res.status(200).json({ liteSlot: liteSlot.slot });
    }
    catch (_a) {
        console.log("There was an issue getting the lite slots");
        return res.status(500);
    }
});
exports.getLiteSlot = getLiteSlot;
const getProSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proslot = yield ProSlot_1.default.findById('6604e612c9e56d02de212b90').select('slot');
        console.log(proslot === null || proslot === void 0 ? void 0 : proslot.slot);
        return !proslot
            ? res.status(404).json({ message: "Slot not found" })
            : res.status(200).json({ proSlot: proslot.slot });
        ;
    }
    catch (_b) {
        console.log("There was an issue getting the lite slots");
        return res.status(500);
    }
});
exports.getProSlot = getProSlot;
const getMaxSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Getting max slots');
        const maxSlot = yield MaxSlot_1.default.findById('6604e617c9e56d02de212b92').select('slot');
        console.log(maxSlot === null || maxSlot === void 0 ? void 0 : maxSlot.slot);
        return !maxSlot
            ? res.status(404).json({ message: "Slot not found" })
            : res.status(200).json({ maxSlot: maxSlot.slot });
        ;
    }
    catch (_c) {
        console.log("There was an issue getting the lite slots");
        return res.status(500);
    }
});
exports.getMaxSlot = getMaxSlot;
const updateLiteSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slot } = req.body;
        console.log(slot, " is slot made");
        const slotID = "6604e5f0c9e56d02de212b8e";
        const updateSlot = yield LiteSlot_1.default.findByIdAndUpdate(slotID, { slot }, { new: true });
        return res.status(201).json({ message: "Lite slot updated", updateSlot });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ message: "Error Updating Lite Slot", error: error.message });
        }
    }
});
exports.updateLiteSlot = updateLiteSlot;
const updateProSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slot } = req.body;
        console.log(slot, " is slot made");
        const slotID = "6604e612c9e56d02de212b90";
        const updateSlot = yield ProSlot_1.default.findByIdAndUpdate(slotID, { slot }, { new: true });
        return res.status(201).json({ message: "Pro slot updated", updateSlot });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ message: "Error Updating Pro Slot", error: error.message });
        }
    }
});
exports.updateProSlot = updateProSlot;
const updateMaxSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slot } = req.body;
        console.log(slot, " is slot made");
        const slotID = "6604e617c9e56d02de212b92";
        const updateSlot = yield MaxSlot_1.default.findByIdAndUpdate(slotID, { slot }, { new: true });
        return res.status(201).json({ message: "Max slot updated", updateSlot });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ message: "Error Updating Max Slot", error: error.message });
        }
    }
});
exports.updateMaxSlot = updateMaxSlot;
