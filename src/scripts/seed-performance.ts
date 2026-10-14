import { db } from "../db";
import {
    tasks,
} from "../db/schema";

import { parseArgs } from 'util'

const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
        projectId: { type: "string", short: 'p' },
        userId: { type: "string", short: 'u' }
    },
    strict: true
})

const projectId = values.projectId;

const userId = values.userId;

if (!projectId || !userId) {
    process.exit(1)
}

const statuses = [
    "TODO",
    "IN_PROGRESS",
    "DONE",
] as const;

const priorities = [
    "LOW",
    "MEDIUM",
    "HIGH",
] as const;

const TASK_COUNT = 20_000;

const run = async () => {
    const rows = Array.from(
        { length: TASK_COUNT },
        (_, index) => ({
            projectId: projectId as string,

            title:
                `Performance test task ${index + 1}`,

            description:
                "Seeded for EXPLAIN ANALYZE testing",

            status:
                statuses[
                index % statuses.length
                ],

            priority:
                priorities[
                index % priorities.length
                ],

            assignedTo:
                index % 2 === 0
                    ? userId as string
                    : null,

            createdBy: userId as string,

            dueDate:
                index % 4 === 0
                    ? new Date(
                        Date.now() +
                        index * 60_000,
                    )
                    : null,
        }),
    );

    const batchSize = 1000;

    for (
        let i = 0;
        i < rows.length;
        i += batchSize
    ) {
        await db
            .insert(tasks)
            .values(
                rows.slice(
                    i,
                    i + batchSize,
                ),
            );
    }

    console.log(
        `Inserted ${TASK_COUNT} tasks`,
    );

    process.exit(0);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});