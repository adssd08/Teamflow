import { ValidationError } from "../errors"
import { asyncHandler } from "../middleware/async-handler"

import * as attachmentService from '../services/attachment.service'

export const uploadAttachment = asyncHandler(
    async (req, res) => {
        if (!req.file) {
            throw new ValidationError(
                "Attachment file is required"
            )
        }

        const attachment = await attachmentService
            .createTaskAttachment(
                req.params.workspaceId as string,
                req.params.projectId as string,
                req.params.taskId as string,
                req.user!.id,
                req.file
            )

        res.status(201)
            .json({
                success: true,
                data: attachment
            })
    }
)