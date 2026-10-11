import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createWorkspaceSchema, updateWorkspaceScehma, workspaceIdSchema } from "../validators/workspace.validator";
import { createWorkspace, deleteWorkspace, getWorkspace, listWorkspaces, updateWorkspace } from "../controllers/workspace.controller";
import { validate, validateParams } from "../middleware/validate.middleware";
import { authorizeWorkspaceRoles } from "../middleware/wrokspace-authorization.middleware";
import { addMember, listMembers, removeMember, updateMemberRole } from "../controllers/workspace-member.controller";
import { addWorkspaceMemberSchema, updateWorkspaceMemberSchema, workspaceIdParamsSchema, workspaceMemberParamsSchema } from "../validators/workspace-member.validator";

const router = Router();

router.use(authenticate)

router.post(
    "/",
    validate(createWorkspaceSchema),
    createWorkspace
)

router.get(
    "/",
    listWorkspaces
)

router.get(
    "/:id",
    validateParams(workspaceIdSchema),
    getWorkspace
)

router.patch(
    "/:id",
    validateParams(workspaceIdSchema),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
    ),
    validate(updateWorkspaceScehma),
    updateWorkspace
)

router.delete(
    "/:id",
    validateParams(workspaceIdSchema),
    authorizeWorkspaceRoles(
        "OWNER"
    ),
    deleteWorkspace
)

router.get(
    "/:workspaceId/members",
    validateParams(workspaceIdParamsSchema),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    listMembers
)

router.post(
    "/:workspaceId/members",
    validateParams(
        workspaceIdParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    validate(
        addWorkspaceMemberSchema
    ),
    addMember
)

router.patch(
    "/:workspaceId/members/:userId",
    validateParams(
        workspaceMemberParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
    ),
    validate(
        updateWorkspaceMemberSchema
    ),
    updateMemberRole
)

router.delete(
    "/:workspaceId/members/:userId",
    validateParams(
        workspaceMemberParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    removeMember
)

export default router;