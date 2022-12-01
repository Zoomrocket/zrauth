import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { OrganizationService } from "src/organization/organization.service";
import { AdminGuard } from "src/security/admin.guard";
import { AddUserOrgDto } from "./admin.dto";

@UseGuards(AdminGuard)
@Controller("/v1/admin")
export class AdminController {

    constructor(
        private readonly _organizationService: OrganizationService
    ) { }

    @Post("/organizations/users/invite-user")
    async postInvite(@Body() body: AddUserOrgDto, @Res() res: Response) {
        try {
            await this._organizationService.inviteUser(body.email, body.name, body.organization_id, body.roles);
            return { "detail": "done" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            return { detail: "unable to invite user" };
        }
    }

}
