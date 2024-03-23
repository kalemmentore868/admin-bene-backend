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
// Define cron job to update status of investments to 'Ready for Deposit' every day at midnight
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find investments with status 'Pending' and update their status to 'Ready for Deposit'
        yield Investment_1.default.updateMany({ status: 'Pending' }, { status: 'Ready for Deposit' });
        console.log('Status of investments updated.');
    }
    catch (error) {
        console.error('Error updating status of investments:', error);
    }
}), {
    timezone: 'Your Timezone' // Update with your timezone
});
