import { UseGuards, Controller, Post, Delete, Body, Query, Res, HttpStatus, Param, Get } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/security/auth.guard";
import { OrganizationAdminGuard } from "src/security/orgadmin.guard";
import { AcceptInvitationDto, CreateOrganizationDto, SendInvitationDto } from "./organization.dto";
import { OrganizationService } from "./organization.service";

@UseGuards(AuthGuard)
@Controller("/v1/organizations")
export class OrganizationController {

    constructor(
        private readonly _organizationService: OrganizationService
    ) { }

    @Post("")
    async postOrganization(@Body() body: CreateOrganizationDto, @Res() res: Response) {
        try {
            await this._organizationService.createOrganization(res.locals.user["user_id"], body.name);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to create organization" };
        }
    }

    @Delete("/:oid/leave-organization")
    async leaveOrganization(@Param() params: any, @Res() res: Response) {
        try {
            await this._organizationService.leaveOrganization(res.locals.user["user_id"], params.oid);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to leave organization" };
        }
    }

    @UseGuards(OrganizationAdminGuard)
    @Delete("/:oid")
    async deleteOrganization(@Param() params: any, @Res() res: Response) {
        try {
            await this._organizationService.deleteOrganization(params.oid);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to delete organization" };
        }
    }

    @UseGuards(OrganizationAdminGuard)
    @Get("/:oid/users")
    async getOrganizationUsers(@Param() params: any, @Res() res: Response) {
        try {
            let result = await this._organizationService.fetchOrganizationUsers(params.oid);
            return result;
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to get organization" };
        }
    }

    @UseGuards(OrganizationAdminGuard)
    @Post("/:oid/users/roles")
    async assignRole(@Param() params: any, @Query() query: any, @Res() res: Response) {
        try {
            await this._organizationService.assignRole(res.locals.user["user_id"], params.oid, query.name);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to assign roles" };
        }
    }

    @UseGuards(OrganizationAdminGuard)
    @Delete("/:oid/users/roles")
    async deleteRole(@Param() params: any, @Query() query: any, @Res() res: Response) {
        try {
            await this._organizationService.deleteRole(res.locals.user["user_id"], params.oid, query.name);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to delete user roles" };
        }
    }

    @UseGuards(OrganizationAdminGuard)
    @Post("/:oid/users/invite-user")
    async postInvite(@Param() params: any, @Body() body: SendInvitationDto, @Res() res: Response) {
        try {
            await this._organizationService.inviteUser(body.email, body.name, params.oid);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to invite user" };
        }
    }

    @Post("/:oid/users/accept-invite")
    async postAcceptInvitation(@Param() params: any, @Body() body: AcceptInvitationDto, @Res() res: Response) {
        try {
            await this._organizationService.acceptInvitation(body.user_id, params.oid, body.code, body.password);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to join organization" };
        }
    }

}
