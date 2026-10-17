export type TaskAssignedJobData = {
    taskId: string;
    workspaceId: string;
    projectId: string;

    assignedTo: string;
    assignedBy: string;

    taskTitle: string;
}