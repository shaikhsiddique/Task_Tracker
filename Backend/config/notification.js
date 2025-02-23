const sendEmail = require("../utils/email");
const cron = require("node-cron");
const {taskModel} = require("../models/task.model");
const {userModel}= require('../models/user.model');
const {notificationModel} = require('../models/notification.model');

const sendNotification = () => {
  cron.schedule("0 0 * * *", async () => { 
    try {
      const today = new Date();
      const upcomingTasks = await taskModel.find({
        deadline: {
          $in: [
            new Date(today.setDate(today.getDate() + 5)).toISOString().split("T")[0],
            new Date(today.setDate(today.getDate() - 3)).toISOString().split("T")[0],
            new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0]
          ],
        },
        status: "pending",
      });

      for (const task of upcomingTasks) {
        const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        let message = `Reminder: Your task "${task.name}" is due in ${daysLeft} days. Please ensure completion before the deadline.`;
        let subject = `Task Deadline Reminder - Due in ${daysLeft} Days`;
        const user = await userModel.findById(task.assignedTo);
        await sendEmail(user.email, message, subject);
        notificationModel.create({user: user._id,
                                  message:message ,
                                   type:  'alarm',
      })
    } 
  }
    catch (error) {
      console.error("Error sending notifications: ", error);
    }
  });
};

module.exports = sendNotification;
