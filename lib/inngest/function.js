import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudgetAlerts = inngest.createFunction(
    { name: "Check Budget Alerts" },
    {cron: "0 */6 * * *"} , // Every 6 hours
    async ({step}) => {
        const budgets = await step.run("fetch-budgets", async () => {
            return await db.budget.findMany({
                include: {
                    user: {
                        include:{
                            accounts:{
                                where:{
                                    isDefault: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        for (const budget of budgets){
            const defaultAccount = budget.user.accounts[0];
            if(!defaultAccount) continue; // Skip if no default account

            await step.run(`chaeck-budget-${budget.id}`, async () => {
                const startdate = new Date();
                startdate.setDate(1); // Start of current month

                // Calculate total expenses for the default account only
                const expenses = await db.transaction.aggregate({
                    where:{
                        userId: budget.userId,
                        accountId: defaultAccount.id, // Only consider default account
                        type: "EXPENSE",
                        date: {
                            gte: startdate,
                            
                        }
                    },
                    _sum: {
                        amount: true,
                    }
                })

                const totalExpenses =  expenses._sum.amount?.toNumber() || 0;
                const budgetAmount = budget.amount.toNumber();
                const percentageUsed = (totalExpenses / budgetAmount) * 100;

                // Check if we shou;d send an alert
                if (
          percentageUsed >= 80 && // Default threshold of 80%
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ){
            // Send alert email
            await sendEmail({
                to: budget.user.email,
                subject: `Budget Alert for ${defaultAccount.name}`,
                react: EmailTemplate({
                    userName: budget.user.name,
                    type: "budget-alert",
                    data: {
                        percentageUsed,
                        budgetAmount: parseInt(budgetAmount).toFixed(1),
                        totalExpenses: parseInt(totalExpenses).toFixed(1),
                        accountName: defaultAccount.name,
                    }
                })
            })

            // Update lastAlertSent
            await db.budget.update({
                where: { id: budget.id },
                data: { lastAlertSent: new Date() },
            })
        }
            })
        }
    }
)