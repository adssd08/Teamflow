declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            }

            workspaceMembership?: {
                workspaceId: string;
                userId: string;
                role: "OWNER" | "ADMIN" | "MEMBER";
            }
        }
    }
}

export { };