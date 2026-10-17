import { Queue } from 'bullmq';

import { bullmqConnection } from './connection';
import type { TaskAssignedJobData } from './notification.types';

export const notificationQueue = new Queue<TaskAssignedJobData>(
    "notifications",
    {
        connection: bullmqConnection,

        defaultJobOptions: {
            attempts: 3,

            backoff: {
                type: "exponential",
                delay: 1000,
            },

            removeOnComplete: true,

            removeOnFail: false,
        }
    }
)

export const enqueueTaskAssigned = async (
    data: TaskAssignedJobData
) => {
    return notificationQueue.add(
        "task-assigned",
        data,
        {
            jobId: `task-assigned:${data.taskId}:${data.assignedTo}`
        }
    )
}