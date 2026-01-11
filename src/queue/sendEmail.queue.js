import { Queue, Worker } from "bullmq";
import redisConnection from "../database/redis.database.js";
import { sendEmail } from "../utils/sendEmail.utils.js";

const sendEmailQueue = new Queue("sendEmail");

export const sendEmailQueueWorker = new Worker(
  "sendEmail",
  async ({ data }) => {
    await sendEmail(data);
  },
  { connection: redisConnection }
);

export default sendEmailQueue;
