export class UniqueConstraintError extends Error {
    constructor(message = "Unique constraint violated") {
        super(message);
    }
}