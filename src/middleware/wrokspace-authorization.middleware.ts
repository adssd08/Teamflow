import type { NextFunction, Request, Response } from "express";
import type { WorkspaceMemberRole } from "../db/schema";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors";
import { findMembership } from "../repositories/workspace-member.repository";


export const authorizeWorkspaceRoles = (
    ...allowedRoles: WorkspaceMemberRole[]
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            return next(
                new UnauthorizedError(
                    "Authentication Failed",
                )
            )
        }

        const workspaceId: string = (req.params.id ?? req.params.workspaceId) as string;

        if (!workspaceId) {
            return next(
                new NotFoundError(
                    "Workspace not found"
                )
            )
        }

        try {
            const membership = await findMembership(
                workspaceId,
                req.user.id,
            )

            if (!membership) {
                return next(
                    new NotFoundError(
                        "Workspace not found"
                    )
                )
            }

            if (
                !allowedRoles.includes(
                    membership.role
                )
            ) {
                return next(
                    new ForbiddenError(
                        "You do not have permission to perform this action"
                    )
                )
            }

            req.workspaceMembership = membership;

            next();
        } catch (error) {
            next(error)
        }
    }
}