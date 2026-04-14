const createTasks = (tasks) => {
  try {
    const taskList = [];

    if (tasks.includes("create_followup_task")) {
      taskList.push("Follow up with customer in 24 hours");
    }

    if (tasks.includes("flag_customer_issue")) {
      taskList.push("Mark issue as high priority");
    }

    return taskList;
  } catch (error) {
    console.error("Task Agent Error:", error.message);
    throw new Error("Task creation failed");
  }
};

module.exports = { createTasks };