import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createWorkspaceSchema, updateWorkspaceScehma, workspaceIdSchema } from "../validators/workspace.validator";
import { createWorkspace, deleteWorkspace, getWorkspace, listWorkspaces, updateWorkspace } from "../controllers/workspace.controller";
import { validate, validateParams } from "../middleware/validate.middleware";

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
    validate(updateWorkspaceScehma),
    updateWorkspace
)

router.delete(
    "/:id",
    validateParams(workspaceIdSchema),
    deleteWorkspace
)

export default router;