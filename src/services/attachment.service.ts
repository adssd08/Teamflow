import fs from 'node:fs/promises'

import { NotFoundError } from '../errors'
import * as projectRepository from '../repositories/project.repository'
import * as taskRepository from '../repositories/task.repository'
import * as attachmentRepository from '../repositories/attachment.repository'

export const createTaskAttachment = async (
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    file: Express.Multer.File,
) => {

    try {
        const project = await projectRepository
            .findProjectInWorkspace(
                workspaceId,
                projectId
            )
        if (!project) {
            throw new NotFoundError(
                "Project not found",
            )
        }

        const task = await taskRepository
            .findTaskInProject(
                projectId,
                taskId
            )

        if (!task) {
            throw new NotFoundError(
                "Task not found"
            )
        }

        const attachment = await attachmentRepository
            .createAttachment({
                taskId,
                uploadedBy: userId,

                originalName: file.originalname,
                storageKey: file.filename,

                mimeType: file.mimetype,
                sizeBytes: file.size
            })
        return attachment;
    } catch (error) {
        try {
            await fs.unlink(file.path);
        } catch (cleanupError) {
            if (
                !(
                    cleanupError instanceof Error &&
                    "code" in cleanupError &&
                    cleanupError.code === "ENOENT"
                )
            ) {
                console.error("Failed to clean up attachment file", {
                    path: file.path,
                    error: cleanupError,
                });
            }
        }

        throw error
    }

}

