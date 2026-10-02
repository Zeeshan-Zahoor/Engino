import Project from "../models/project.model.js";
import Requirement from "../models/requirement.model.js";
import Task from "../models/task.model.js";

const getStartOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);

    return result;
};

const getEndOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();

    const diff = day === 0 ? 0 : 7 - day;

    result.setDate(result.getDate() + diff);
    result.setHours(23, 59, 59, 999);

    return result;
}


const getDashboardInsights = async (workspaceId, userId, role) => {
    const projects = await Project.find({ workspaceId })
        .select("_id")
        .lean();

    const projectIds = projects.map((project) => project._id);

    if (projectIds.length === 0) {
        return [];
    }

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);

    const [
        clarificationRequirements,
        estimatedRequirements,
        highPriorityTasks,
        dueThisWeekTasks,
        overdueTasks,
        unassignedTasks,
    ] = await Promise.all([

        // Requirements needing clarification
        Requirement.find({
            projectId: { $in: projectIds },
            aiStatus: "Needs Clarification",
        })
        .select("_id projectId name")
        .lean(),

        // Latest requirement with an AI estimate
        Requirement.find({
            projectId: { $in: projectIds },
            estimatedEffortMinutes: { $gt: 0 },
        })
        .select("_id projectId name complexity estimatedEffortMinutes     updatedAt")
        .sort({ updatedAt: -1 })
        .limit(1)
        .lean(),

        // High-priority unfinished tasks
        Task.find({
            projectId: { $in: projectIds },
            priority: "High",
        status: { $ne: "Done" },
        })
        .select("_id projectId title")
        .lean(),

        // Tasks due this week
        Task.find({
            projectId: { $in: projectIds },
            status: { $ne: "Done" },
            dueDate: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            },
            ...(role === "Member" ? { assignee: userId } : {}),
        })
        .select("_id projectId title dueDate assignee")
        .lean(),

        // Overdue tasks
        Task.find({
            projectId: { $in: projectIds },
            status: { $ne: "Done" },
            dueDate: {
                $lt: now,
            },
            ...(role === "Member" ? { assignee: userId } : {}),
        })
        .select("_id projectId title dueDate assignee")
        .lean(),

        // Unassigned tasks
        Task.find({
            projectId: { $in: projectIds },
            status: { $ne: "Done" },
            assignee: null,
        })
        .select("_id projectId title")
        .lean(),
    ]);

    const insights = [];

    // Requirements needing clarifications
    if(clarificationRequirements.length > 0) {
        const names = clarificationRequirements
            .slice(0, 2)
            .map((requirement) => requirement.name);
        
        const remaining = clarificationRequirements.length - names.length;

        insights.push({
            type: "clarification",
            severity: "warning",
            title: `${clarificationRequirements.length} ${
                clarificationRequirements.length === 1
                ? "requirement needs"
                : "requirements need"
            } clarification`,
            description:
                names.join(", ") +
                (remaining > 0 ? ` +${remaining} more` : ""),
            action: {
                type: "requirements",
            },
        });
    }

    // Latest requirement estimate
    if (estimatedRequirements.length > 0) {
        const requirement = estimatedRequirements[0];

        const hours = requirement.estimatedEffortMinutes / 60;

        const formattedHours =
        Number.isInteger(hours)
            ? `${hours} hour${hours === 1 ? "" : "s"}`
            : `${hours.toFixed(1)} hours`;

        insights.push({
            type: "estimate",
            severity: "success",
            title: `${requirement.name} estimated`,
            description: `${formattedHours} · ${requirement.complexity} Complexity`,
            action: {
                type: "requirement",
                projectId: requirement.projectId,
                requirementId: requirement._id,
            },
        });
    }

    // High-priority tasks
    if (highPriorityTasks.length > 0) {
        const names = highPriorityTasks
        .slice(0, 2)
        .map((task) => task.title);

        const remaining = highPriorityTasks.length - names.length;

        insights.push({
            type: "high_priority",
            severity: "warning",
            title: `${highPriorityTasks.length} high-priority ${
                highPriorityTasks.length === 1 ? "task needs" : "tasks need"
            } attention`,
            description:
                names.join(", ") +
                (remaining > 0 ? ` +${remaining} more` : ""),
            action: {
                type: "tasks",
                filter: "high-priority",
            },
        });
    }

    // Tasks due this week

    if (dueThisWeekTasks.length > 0) {
        insights.push({
            type: "due_this_week",
            severity: "success",
            title: `${
                role === "Member" ? "You have" : "There are"
            } ${dueThisWeekTasks.length} ${
                dueThisWeekTasks.length === 1 ? "task" : "tasks"
            } due this week`,
            description: "Stay on track!",
            action: {
                type: "tasks",
                filter: "due-this-week",
            },
        });
    }

    // Overdue tasks

    if (overdueTasks.length > 0) {
        const names = overdueTasks
            .slice(0, 2)
            .map((task) => task.title);

        const remaining = overdueTasks.length - names.length;

        insights.push({
            type: "overdue",
            severity: "error",
            title: `${overdueTasks.length} ${
                overdueTasks.length === 1 ? "task is" : "tasks are"
            } overdue`,
            description:
                names.join(", ") +
                (remaining > 0 ? ` +${remaining} more` : ""),
            action: {
                type: "tasks",
                filter: "overdue",
            },
        });
    }

    // Unassigned tasks

    if (unassignedTasks.length > 0) {
        const names = unassignedTasks
            .slice(0, 2)
            .map((task) => task.title);

        const remaining = unassignedTasks.length - names.length;

        insights.push({
            type: "unassigned",
            severity: "info",
            title: `${unassignedTasks.length} ${
                unassignedTasks.length === 1
                ? "task is"
                : "tasks are"
            } waiting for assignment`,
            description:
                names.join(", ") +
                (remaining > 0 ? ` +${remaining} more` : ""),
            action: {
                type: "tasks",
                filter: "unassigned",
            },
        });
    }

    return insights;
}

export default getDashboardInsights;