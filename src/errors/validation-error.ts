import { AppError } from "./app-error";


export class ValidationError extends AppError {
    public readonly details?: unknown;
    constructor(
        message = "Invalid request",
        details?: unknown
    ) {
        super(message, 400);

        this.details = details;
    }
}