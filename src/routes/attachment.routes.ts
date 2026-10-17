import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validateParams } from "../middleware/validate.middleware";
import { authorizeWorkspaceRoles } from "../middleware/wrokspace-authorization.middleware";
import { uploadTaskAttachment } from "../middleware/upload.middleware";
import { uploadAttachment } from "../controllers/attachment.controller";
import { projectTaskParamsSchema } from "../validators/task.validator";

const router = Router({
    mergeParams: true
})


router.post(
    "/",

    authenticate,

    validateParams(
        projectTaskParamsSchema,
    ),

    authorizeWorkspaceRoles(
        "OWNER",
        "ADMIN",
        "MEMBER"
    ),

    uploadTaskAttachment,

    uploadAttachment
)

export default router;