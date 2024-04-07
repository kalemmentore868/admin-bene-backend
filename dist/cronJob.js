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
exports.startCronJobForInvestment = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Investment_1 = __importDefault(require("./models/Investment"));
const moment_1 = __importDefault(require("moment"));
// A map to store cron jobs by investment ID
const cronJobs = new Map();
const startCronJobForInvestment = (investmentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a cron job for this investment already exists
    if (cronJobs.has(investmentId)) {
        console.log(`A cron job for investment ${investmentId} is already running.`);
        return; // Exit if there's already a cron job for this investment
    }
    // Schedule the cron job to run every 10 seconds for demonstration
    const job = node_cron_1.default.schedule('*/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Checking investment status for ID ${investmentId} at ${new Date().toISOString()}`);
        try {
            const investment = yield Investment_1.default.findById(investmentId);
            if (!investment) {
                console.log(`No investment found for ID ${investmentId}, stopping cron job.`);
                job.stop(); // Stop the cron job if the investment does not exist
                cronJobs.delete(investmentId); // Remove from the map
                return;
            }
            if (investment.status === 'Pending' && (0, moment_1.default)(investment.createdAt).add(1, 'hours').toDate() <= new Date()) {
                yield Investment_1.default.findByIdAndUpdate(investmentId, { status: 'Ready for Deposit' });
                console.log(`Investment ${investmentId} updated to 'Ready for Deposit' at ${new Date().toISOString()}`);
                job.stop(); // Stop the cron job after updating
                cronJobs.delete(investmentId); // Remove from the map
            }
        }
        catch (error) {
            console.error(`Error in cron job for investment ${investmentId}:`, error);
        }
    }), {
        scheduled: true,
        timezone: "America/Port_of_Spain"
    });
    cronJobs.set(investmentId, job); // Store the job using the investment ID as the key
});
exports.startCronJobForInvestment = startCronJobForInvestment;
