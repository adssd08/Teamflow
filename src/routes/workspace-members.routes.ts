import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate, validateParams } from "../middleware/validate.middleware";
import { addWorkspaceMemberSchema, updateWorkspaceMemberSchema, workspaceIdParamsSchema, workspaceMemberParamsSchema } from "../validators/workspace-member.validator";
import { authorizeWorkspaceRoles } from "../middleware/wrokspace-authorization.middleware";
import { addMember, listMembers, removeMember, updateMemberRole } from "../controllers/workspace-member.controller";

const router = Router({
    mergeParams: true
});

router.use(authenticate)

router.get(
    "/",
    validateParams(workspaceIdParamsSchema),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    listMembers
)

router.post(
    "/",
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
    "/:userId",
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
    "/:userId",
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