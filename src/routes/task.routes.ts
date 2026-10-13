import { Router } from "express";
import { validate, validateParams, validateQuery } from "../middleware/validate.middleware";
import { createTaskSchema, projectIdParamsSchema, projectTaskParamsSchema, taskListQuerySchema, updateTaskSchema } from "../validators/task.validator";
import { authorizeWorkspaceRoles } from "../middleware/wrokspace-authorization.middleware";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router({
    mergeParams: true
})

router.use(authenticate)

router.get(
    "/",
    validateParams(
        projectIdParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    validateQuery(
        taskListQuerySchema
    ),
    listTasks

)

router.post(
    "/",
    validateParams(
        projectIdParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    validate(
        createTaskSchema
    ),
    createTask
)

router.get(
    "/:taskId",
    validateParams(
        projectTaskParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),
    getTask
)

router.patch(
    "/:taskId",
    validateParams(
        projectTaskParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN"
    ),
    validate(
        updateTaskSchema
    ),
    updateTask
)

router.delete(
    "/:taskId",
    validateParams(
        projectTaskParamsSchema
    ),
    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
    ),
    deleteTask
)

export default router;