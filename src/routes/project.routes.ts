import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate, validateParams } from "../middleware/validate.middleware";
import { authorizeWorkspaceRoles } from "../middleware/wrokspace-authorization.middleware";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "../controllers/project.controller";
import { createProjectSchema, updateProjectSchema, workspaceIdParamsSchema, workspaceProjectParamsSchema } from "../validators/project.validator";

const router = Router({
    mergeParams: true
})

router.use(authenticate)

router.get(
    "/",
    validateParams(
        workspaceIdParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    listProjects
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
        createProjectSchema
    ),
    createProject
)

router.get(
    "/:projectId",
    validateParams(
        workspaceProjectParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    getProject
)

router.patch(
    "/:projectId",
    validateParams(
        workspaceProjectParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    validate(
        updateProjectSchema
    ),
    updateProject
)

router.delete(
    "/:projectId",
    validateParams(
        workspaceProjectParamsSchema,
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    deleteProject
)

export default router;