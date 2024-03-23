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
const node_cron_1 = __importDefault(require("node-cron"));
const Investment_1 = __importDefault(require("./models/Investment"));
const moment_1 = __importDefault(require("moment")); // Assuming you're using moment.js for date manipulation
// Cron job to check every minute for investment schemas pending for at least 1 hour
node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Cron job started at ${new Date().toISOString()}`); // Log when the cron job starts checking
    try {
        const oneHourAgo = (0, moment_1.default)().subtract(1, 'hours').toDate();
        // Find investments that are 'Pending' and created more than 1 hour ago
        const investmentsToUpdate = yield Investment_1.default.find({ status: 'Pending', createdAt: { $lte: oneHourAgo } });
        if (investmentsToUpdate.length > 0) {
            yield Investment_1.default.updateMany({ _id: { $in: investmentsToUpdate.map(inv => inv._id) } }, { status: 'Ready for Deposit' });
            // Log each investment schema's status update
            investmentsToUpdate.forEach(inv => {
                console.log(`Investment schema with ID ${inv._id} updated to 'Ready for Deposit' at ${new Date().toISOString()}`);
            });
        }
        else {
            console.log('No eligible investments found to update.');
        }
    }
    catch (error) {
        console.error('Error updating investments to Ready for Deposit:', error);
    }
}), {
    scheduled: true,
    timezone: "America/Port_of_Spain" // Adjust timezone as needed
});
