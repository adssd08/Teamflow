import path from "node:path";
import crypto from "node:crypto"

import multer from 'multer';

import {
    ALLOWED_ATTACHMENT_MIME_TYPES,
    MAX_ATTACHMENT_SIZE,
    uploadDirectory
} from "../config/upload";

import {
    ValidationError
} from '../errors'


// Store accepted files on disk instead of keeping their contents in memory.
// Multer uses these callbacks to choose the destination and stored filename.
const storage = multer
    .diskStorage({
        destination: (
            _req,
            _file,
            callback,
        ) => {
            // Multer callbacks use (error, result): null means success.
            callback(
                null,
                uploadDirectory
            )
        },

        filename: (
            _req,
            file,
            callback,
        ) => {
            // Keep only the original extension (normalized to lowercase), then
            // use a UUID so client filenames do not determine the stored name.
            // The extension is preserved for naming, not used to validate type.
            const extension = path.extname(
                file.originalname,
            ).toLowerCase();

            const filename = `${crypto.randomUUID()}${extension}`;

            callback(
                null,
                filename
            )
        }
    })

/**
 * Parse a multipart/form-data task attachment sent in the `file` field.
 *
 * Flow: check the declared MIME type, stream the accepted file to disk while
 * enforcing limits, then expose its metadata (including path) as `req.file`
 * for the attachment controller. This does not create a database record.
 *
 * A missing file is left for the controller to reject. Filter, storage, and
 * limit errors are forwarded to Express's error handler.
 */
export const uploadTaskAttachment = multer({
    storage,

    limits: {
        // Maximum bytes per file; Multer raises LIMIT_FILE_SIZE if exceeded.
        fileSize: MAX_ATTACHMENT_SIZE,

        // Allow at most one file across the entire request.
        files: 1,
    },

    fileFilter: (
        _req,
        file,
        callback
    ) => {
        // This checks the client-provided MIME type, not the actual file bytes.
        // Reject unsupported types before the disk storage callbacks run.
        if (
            !ALLOWED_ATTACHMENT_MIME_TYPES
                .has(
                    file.mimetype,
                )
        ) {
            // Passing an error aborts the upload with our validation message.
            return callback(
                new ValidationError(
                    "Unsupported attachment type"
                )
            )
        }

        // No error + true tells Multer to accept and store this file.
        callback(
            null,
            true
        )
    }
}).single(
    // This must match the multipart field name; other file fields are rejected.
    "file"
)
