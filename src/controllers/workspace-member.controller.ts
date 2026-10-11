import { asyncHandler } from "../middleware/async-handler";
import * as workspaceMemberService from '../services/workspace-member.service'


export const addMember = asyncHandler(
    async (req, res) => {
        const member = await workspaceMemberService.
            addMember(
                req.params.workspaceId as string,
                req.workspaceMembership!.role,
                req.body
            )

        res.status(201).json({
            success: true,
            data: member
        })
    }
)

export const listMembers = asyncHandler(
    async (req, res) => {
        const members = await workspaceMemberService.listMembers(
            req.params.workspaceId as string,
        )

        res.status(200).json({
            success: true,
            data: members
        })
    }
)

export const updateMemberRole = asyncHandler(
    async (req, res) => {
        const membership = await workspaceMemberService
            .updateMemberRole(
                req.params.workspaceId as string,
                req.params.userId as string,
                req.workspaceMembership!.role,
                req.body.role,
            )

        res.status(200).json({
            success: true,
            data: membership
        })
    }
)

export const removeMember = asyncHandler(
    async (req, res) => {
        await workspaceMemberService
            .removeMember(
                req.params.workspaceId as string,
                req.params.userId as string,
                req.workspaceMembership!.role,
            )

        res.status(204).send()
    }
)