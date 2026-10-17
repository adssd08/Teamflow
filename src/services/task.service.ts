
import * as taskRepository from '../repositories/task.repository'
import * as projectRepository from '../repositories/project.repository'
import * as workspaceMemberRepository from '../repositories/workspace-member.repository'
import { NotFoundError, ValidationError } from '../errors';
import type { CreateTaskInput, TaskListQuery, UpdateTaskInput } from '../validators/task.validator';
import { enqueueTaskAssigned } from '../queues/notification.queue';

const validateAssignee = async (
    workspaceId: string,
    assignedTo?: string | null,
) => {
    if (
        assignedTo === undefined ||
        assignedTo === null
    ) {
        return;
    }

    const membership = await workspaceMemberRepository
        .findMembership(
            workspaceId,
            assignedTo
        )

    if (!membership) {
        throw new ValidationError(
            "Assignee must belong to the workspace"
        )
    }
}

const validateProject = async (
    workspaceId: string,
    projectId: string,
) => {
    const project = await projectRepository.findProjectInWorkspace(
        workspaceId,
        projectId
    )

    if (!project) {
        throw new NotFoundError(
            "Project not found"
        )
    }
}

export const createTask = async (
    workspaceId: string,
    projectId: string,
    userId: string,
    input: CreateTaskInput
) => {

    await validateProject(
        workspaceId,
        projectId
    )

    await validateAssignee(
        workspaceId,
        input.assignedTo
    );

    return taskRepository.createTask({
        projectId,
        title: input.title,
        description: input.description ?? null,
        status: input.status,
        priority: input.priority,
        assignedTo: input.assignedTo ?? null,
        createdBy: userId,
        dueDate: input.dueDate === undefined ? undefined : input.dueDate === null ? null : new Date(input.dueDate)
    })
}

export const listTasks = async (
    workspaceId: string,
    projectId: string,
    query: TaskListQuery
) => {
    await validateProject(
        workspaceId,
        projectId
    )

    const [taskList, total] = await Promise.all([
        taskRepository
            .findTasksByProject(
                projectId,
                query
            ),
        taskRepository.countTasksByProject(
            projectId,
            query
        )
    ])

    const totalPages = Math.ceil(
        total / query.limit,
    )

    return {
        tasks: taskList,

        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasNextPage: query.page < totalPages,
            hasPreviousPage: query.page > 1
        }
    }
}

export const getTask = async (
    workspaceId: string,
    projectId: string,
    taskId: string,
) => {

    await validateProject(
        workspaceId,
        projectId
    )

    const task = await taskRepository.findTaskInProject(
        projectId,
        taskId,
    )

    if (!task) {
        throw new NotFoundError(
            "Task not found"
        )
    }

    return task;
}

export const updateTask = async (
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    input: UpdateTaskInput,
) => {

    await validateProject(
        workspaceId,
        projectId
    )

    if (input.assignedTo !== undefined) {
        await validateAssignee(
            workspaceId,
            input.assignedTo
        )
    }

    const existingTask = await taskRepository
        .findTaskInProject(
            projectId,
            taskId,
        );

    if (!existingTask) {
        throw new NotFoundError(
            "Task not found"
        )
    }

    const task = await taskRepository.updateTask(
        projectId,
        taskId,
        {
            title: input.title,
            description: input.description,
            status: input.status,
            priority: input.priority,
            assignedTo: input.assignedTo,
            dueDate: input.dueDate === undefined ? undefined : input.dueDate === null ? null : new Date(input.dueDate)
        }
    )

    if (!task) {
        throw new Error(
            "Something went wrong"
        )
    }

    const assigneeChanged = input.assignedTo !== undefined &&
        input.assignedTo !== null &&
        input.assignedTo !== existingTask.assignedTo


    if (assigneeChanged) {
        try {
            await enqueueTaskAssigned({
                taskId: task.id,
                workspaceId,
                projectId,
                assignedTo: input.assignedTo!,
                assignedBy: userId,
                taskTitle: task.title
            })
        } catch (error) {
            console.error(
                "Failed to enqueue notification job",
                error
            )
        }
    }

    return task;
}

export const deleteTask = async (
    workspaceId: string,
    projectId: string,
    taskId: string
) => {

    await validateProject(
        workspaceId,
        projectId
    )

    const task = await taskRepository.deleteTask(
        projectId,
        taskId,
    )

    if (!task) {
        throw new NotFoundError(
            "Task not found"
        )
    }
}