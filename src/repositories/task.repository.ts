import { and, eq } from 'drizzle-orm';

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

export const createTask = async (
    input: CreateTaskRecord
) => {
    const [task] = await db
        .insert(tasks)
        .values(input)
        .returning();

    return task;
}

export const findTasksByProject = async (
    projectId: string
) => {
    return db
        .select()
        .from(tasks)
        .where(
            eq(
                tasks.projectId,
                projectId
            )
        )
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