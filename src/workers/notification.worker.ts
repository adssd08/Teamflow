import { Job, Worker } from 'bullmq';

import { bullmqConnection } from '../queues/connection';
import type { TaskAssignedJobData } from '../queues/notification.types';

const worker = new Worker<TaskAssignedJobData>(
    "notifications",
    async (job) => {
        switch (job.name) {
            case "task-assigned": {
                await handleTaskAssigned(job);
                return;
            }

            default:
                throw new Error(
                    `Unknown job: ${job.name}`
                )
        }
    },
    {
        connection: bullmqConnection,
        concurrency: 5
    }
)

const handleTaskAssigned = async (job: Job<TaskAssignedJobData>) => {
    const data = job.data;
    console.log(
        "Sending assignment notification",
        {
            taskId: data.taskId,

            assignedTo: data.assignedTo
        }
    )

    await new Promise(
        (resolve) => setTimeout(
            resolve,
            3000
        )
    )

    console.log(
        "Notification sent"
    )
}

worker.on(
    "completed",
    (job) => {
        console.log(
            `Job ${job.id} completed`
        )
    }
)

worker.on(
    "failed",
    (job, error) => {
        console.error(
            `Job ${job?.id} failed`,
            {
                attemptsMade: job?.attemptsMade,

                message: error.message
            }
        )
    }
)

worker.on(
    "error",
    (error) => {
        console.error(
            "Worker error",
            error
        )
    }
)