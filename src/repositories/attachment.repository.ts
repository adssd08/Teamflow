import { db } from "../db";

import { attachments } from "../db/schema";

type CreateAttachmentInput = {
    taskId: string;
    uploadedBy: string;
    originalName: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
}

export const createAttachment = async (
    input: CreateAttachmentInput,
) => {
    const [attachment] = await db
        .insert(
            attachments
        )
        .values(
            input
        )
        .returning();

    return attachment
}