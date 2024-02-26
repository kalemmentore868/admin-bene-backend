import cron from 'node-cron';
import Investment from './models/Investment';
import moment from 'moment';

// A map to store cron jobs by investment ID
const cronJobs = new Map();

export const startCronJobForInvestment = async (investmentId: string) => {
    // Check if a cron job for this investment already exists
    if (cronJobs.has(investmentId)) {
        console.log(`A cron job for investment ${investmentId} is already running.`);
        return; // Exit if there's already a cron job for this investment
    }

    // Schedule the cron job to run every 10 seconds for demonstration
    const job = cron.schedule('*/10 * * * * *', async () => {
        console.log(`Checking investment status for ID ${investmentId} at ${new Date().toISOString()}`);

        try {
            const investment = await Investment.findById(investmentId);
            if (!investment) {
                console.log(`No investment found for ID ${investmentId}, stopping cron job.`);
                job.stop(); // Stop the cron job if the investment does not exist
                cronJobs.delete(investmentId); // Remove from the map
                return;
            }

            if (investment.status === 'Pending' && moment(investment.createdAt).add(1, 'hours').toDate() <= new Date()) {
                await Investment.findByIdAndUpdate(investmentId, { status: 'Ready for Deposit' });
                console.log(`Investment ${investmentId} updated to 'Ready for Deposit' at ${new Date().toISOString()}`);
                job.stop(); // Stop the cron job after updating
                cronJobs.delete(investmentId); // Remove from the map
            }
        } catch (error) {
            console.error(`Error in cron job for investment ${investmentId}:`, error);
        }
    }, {
        scheduled: true,
        timezone: "America/Port_of_Spain"
    });

    cronJobs.set(investmentId, job); // Store the job using the investment ID as the key
};
