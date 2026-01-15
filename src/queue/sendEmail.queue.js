import { Queue, Worker } from "bullmq";
import { sendEmail } from "../utils/sendEmail.utils.js";

import { redisConnectionOption } from "../database/redis.database.js";

const sendEmailQueue = new Queue("sendEmail", {
  connection: redisConnectionOption,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 100,
  },
});

export const sendEmailQueueWorker = new Worker(
  "sendEmail",
  async ({ data }) => {
    await sendEmail(data);
  },
  { connection: redisConnectionOption }
);

export default sendEmailQueue;
