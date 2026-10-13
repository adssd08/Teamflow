import {
    and,
    asc,
    count,
    desc,
    eq,
} from 'drizzle-orm';

import { db } from '../db';
import { tasks, type TaskPriority, type TaskStatus } from '../db/schema'

type CreateTaskRecord = {
    projectId: string;
    title: string;
    description?: string | null;
    status?: TaskStatus,
    priority?: TaskPriority,
    assignedTo?: string | null;
    createdBy: string;
    dueDate?: Date | null;
}

type UpdateTaskRecord = {
    title?: string;
    description?: string | null;
    status?: TaskStatus,
    priority?: TaskPriority,
    assignedTo?: string | null;
    dueDate?: Date | null;
}

export type TaskQueryOptions = {
    page: number;
    limit: number;

    status?: TaskStatus

    priority?: TaskPriority

    assignedTo?: string;

    sortBy:
    | "createdAt"
    | "updatedAt"
    | "dueDate"
    | "priority"
    | "status"
    | "title";

    order:
    | "asc"
    | "desc";
};

const sortColumns = {
    createdAt: tasks.createdAt,
    updatedAt: tasks.updatedAt,
    dueDate: tasks.dueDate,
    priority: tasks.priority,
    status: tasks.status,
    title: tasks.title,
} as const

const buildTaskConditions = (
    projectId: string,
    filters: Pick<
        TaskQueryOptions,
        | "status"
        | "priority"
        | "assignedTo"
    >,
) => {
    const conditions = [
        eq(
            tasks.projectId,
            projectId,
        ),
    ]

    if (filters.status) {
        conditions.push(
            eq(
                tasks.status,
                filters.status,
            ),
        );
    }

    if (filters.priority) {
        conditions.push(
            eq(
                tasks.priority,
                filters.priority,
            ),
        );
    }

    if (filters.assignedTo) {
        conditions.push(
            eq(
                tasks.assignedTo,
                filters.assignedTo,
            ),
        );
    }

    return conditions
}

export const createTask = async (
    input: CreateTaskRecord
) => {
    const [task] = await db
        .insert(tasks)
        .values(input)
        .returning();

    return task;
}

export const countTasksByProject = async (
    projectId: string,
    options: Pick<
        TaskQueryOptions,
        | "status"
        | "priority"
        | "assignedTo"
    >,
) => {

    const conditions = buildTaskConditions(
        projectId,
        options
    )

    const [result] = await db
        .select({
            total: count(),
        })
        .from(tasks)
        .where(
            and(...conditions),
        );

    return result?.total || 0;
}

export const findTasksByProject = async (
    projectId: string,
    options: TaskQueryOptions
) => {

    const conditions = buildTaskConditions(
        projectId,
        options
    )


    const sortColumn = sortColumns[options.sortBy];

    const orderBy =
        options.order === "asc"
            ? asc(sortColumn)
            : desc(sortColumn);

    const offset = (options.page - 1) * options.limit;

    return db
        .select()
        .from(tasks)
        .where(
            and(...conditions),
        )
        .orderBy(
            orderBy,
            desc(tasks.id)
        )
        .limit(options.limit)
        .offset(offset)
}

export const findTaskInProject = async (
    projectId: string,
    taskId: string
) => {
    const [task] = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(
                    tasks.id,
                    taskId
                ),
                eq(
                    tasks.projectId,
                    projectId
                )
            )
        )
        .limit(1)

    return task;
}

export const updateTask = async (
    projectId: string,
    taskId: string,
    input: UpdateTaskRecord
) => {
    const [task] = await db
        .update(tasks)
        .set({
            ...input,
            updatedAt: new Date()
        })
        .where(
            and(
                eq(
                    tasks.id,
                    taskId,
                ),
                eq(
                    tasks.projectId,
                    projectId
                )
            )
        )
        .returning()

    return task;
}

export const deleteTask = async (
    projectId: string,
    taskId: string,
) => {
    const [task] = await db
        .delete(tasks)
        .where(
            and(
                eq(
                    tasks.id,
                    taskId
                ),
                eq(
                    tasks.projectId,
                    projectId
                )
            )
        )
        .returning()

    return task;
}