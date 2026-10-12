import Notification from "../models/notification.model.js";

const createTaskAssignmentNotification = async ({
    recipientId,
    actorId,
    task,
    projectId,
}) => {
    if (
        !recipientId ||
        !actorId ||
        recipientId.toString() === actorId.toString()
    ) {
        return;
    }

     try {
        await Notification.create({
        recipient: recipientId,
        actor: actorId,
        type: "TASK_ASSIGNED",
        message: `You have been assigned the task "${task.title}"`,
        taskId: task._id,
        projectId,
        });

    } catch (error) {
        
        console.error("Failed to create task assignment notification:", error);
    }
};

export { createTaskAssignmentNotification };