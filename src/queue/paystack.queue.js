import { Queue, Worker } from "bullmq";
import { redisConnectionOption } from "../database/redis.database.js";
import { Transaction } from "../models/transaction.model.js";
import { Subscription } from "../models/subscription.model.js";

export const paystackEventQueue = new Queue("paystackEvents", {
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100, attempts: 3 },
  connection: redisConnectionOption,
});

export const paystackEventWorker = new Worker(
  "paystackEvents",
  async (job) => {
    try {
      const body = job.data;

      if (body.event === "charge.success") {
        const eventData = body.data;

        const isAlreadyProcessedTransaction = await Transaction.findOne({
          reference: eventData.reference,
        }).exec();

        if (isAlreadyProcessedTransaction) {
          return;
        }

        if (eventData.metadata?.newCustomer) {
          const newCustomer = eventData.metadata?.newCustomer;

          const subCreated = await Subscription.findOne({
            customerCode: eventData.customer.customer_code,
          }).exec();

          if (subCreated) {
            subCreated.isActive = true;
            subCreated.customer = newCustomer;
            await subCreated.save();
          } else {
            const newSub = new Subscription({
              isActive: true,
              customer: newCustomer,
              customerCode: eventData.customer.customer_code,
            });
            await newSub.save();
          }
        }

        await Transaction.create({
          amount: eventData.amount / 100,
          reference: eventData.reference,
          status: eventData.status,
          customerCode: eventData.customer.customer_code,
          createdAt: eventData.created_at,
        });
      }

      if (body.event === "subscription.create") {
        const eventData = body.data;

        const createdSub = await Subscription.findOne({
          customerCode: eventData.customer.customer_code,
        }).exec();

        if (createdSub) {
          createdSub.subscriptionCode = eventData.subscription_code;
          await createdSub.save();
        } else {
          const newSub = new Subscription({
            subscriptionCode: eventData.subscription_code,
            customerCode: eventData.customer.customer_code,
          });
          await newSub.save();
        }
      }
    } catch (error) {
      console.log("Error in Paystack webhook service", error);
      throw error;
    }
  },
  { connection: redisConnectionOption, concurrency: 1 },
);
