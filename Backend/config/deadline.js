const cron = require("node-cron");
const { taskModel } = require("../models/task.model");


const updateTaskStatus = () => {
  cron.schedule("0 0 * * *", async () => { // Runs at 12:00 AM (midnight) daily
    try {
      const overdueTasks = await taskModel.find({
        deadline: { $lt: new Date() },
        status: "pending",
      });

      if (overdueTasks.length > 0) {
        await taskModel.updateMany(
          { _id: { $in: overdueTasks.map((task) => task._id) } },
          { status: "in-complete" }
        );
      }
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
  });
};

module.exports = { updateTaskStatus };
