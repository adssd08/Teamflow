import fs from 'node:fs/promises'
import path from "node:path";

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_MIME_TYPES = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/plain"
])

// Resolve uploads/tasks relative to where the Node process was started.
// With a destination callback, Multer expects this directory to already exist;
// this middleware does not create it.
export const uploadDirectory = path.resolve(
    process.cwd(),
    "uploads",
    "tasks"
);

export const ensureUploadDirectory = async () => {
    await fs.mkdir(
        uploadDirectory,
        {
            recursive: true
        }
    )
};