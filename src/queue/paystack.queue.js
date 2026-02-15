import { Queue, Worker } from "bullmq";
import { redisConnectionOption } from "../database/redis.database.js";
import { Transaction } from "../models/transaction.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Invoice } from "../models/invoice.model.js";

export const paystackEventQueue = new Queue("paystackEvents", {
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100, attempts: 3 },
  connection: redisConnectionOption,
});

export const paystackEventWorker = new Worker(
  "paystackEvents",
  async (job) => {
    try {
      const body = job.data;

      const eventData = body.data;

      if (body.event === "charge.success") {
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
            subCreated.customer = newCustomer;
            await subCreated.save();
          } else {
            const newSub = new Subscription({
              customerCode: eventData.customer.customer_code,
              customer: newCustomer,
            });
            await newSub.save();
          }
        }

        const invoice = await Invoice.findOne({
          customer: eventData.customer.customer_code,
        }).exec();

        if (invoice) {
          invoice.status = "paid";
          await invoice.save();
        } else {
          await Invoice.create({
            invoiceCode: eventData.invoice_code,
            dueAt: Date.now(),
            customer: eventData.customer.customer_code,
            amount: eventData.amount / 100,
            status: "paid",
          });
        }

        await Transaction.create({
          amount: eventData.amount / 100,
          reference: eventData.reference,
          status: eventData.status,
          customerCode: eventData.customer.customer_code,
          createdAt: eventData.created_at,
        });
      }

      if (body.event === "invoice.create") {
        const invoice = await Invoice.findOne({
          customer: eventData.customer.customer_code,
        })
          .lean()
          .exec();

        if (!invoice) {
          await Invoice.create({
            invoiceCode: eventData.invoice_code,
            customer: eventData.customer.customer_code,
            amount: eventData.amount / 100,
            status: "pending",
          });
        }
      }

      if (body.event === "subscription.create") {
        const subCreated = await Subscription.findOne({
          customerCode: eventData.customer.customer_code,
        }).exec();

        if (subCreated) {
          subCreated.subscriptionCode = eventData.subscription_code;
          subCreated.plan = eventData.plan.plan_code;
          subCreated.status = eventData.status;
          await subCreated.save();
        } else {
          const newSub = new Subscription({
            subscriptionCode: eventData.subscription_code,
            customerCode: eventData.customer.customer_code,
            status: eventData.status,
            plan: eventData.plan.plan_code,
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
