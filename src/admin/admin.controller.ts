import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrganizationService } from 'src/organization/organization.service';
import { AdminGuard } from 'src/security/admin.guard';
import { AddUserOrgDto, InviteUserOrgDto, updateUserOrgDto } from './admin.dto';

@UseGuards(AdminGuard)
@Controller('/v1/admin')
export class AdminController {
  constructor(private readonly _organizationService: OrganizationService) {}

  @Post('/organizations/users/invite-user')
  async postInvite(@Body() body: InviteUserOrgDto, @Res() res: Response) {
    try {
      await this._organizationService.inviteUser(
        body.email,
        body.name,
        body.password,
        body.organization_id,
        body.roles,
      );
      return { detail: 'done' };
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to invite user' };
    }
  }

  @Post('/organizations/users')
  async postUser(@Body() body: AddUserOrgDto, @Res() res: Response) {
    try {
      let user = await this._organizationService.addUser(
        body.email,
        body.name,
        body.password,
        body.organization_id,
        body.extra_profile_data,
        body.roles,
      );
      return user;
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to add user' };
    }
  }

  @Patch('/organizations/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: updateUserOrgDto,
    @Res() res: Response,
  ) {
    try {
      let user = await this._organizationService.updateUser(
        id,
        body?.name,
        body?.roles,
        body?.extra_profile_data,
      );
      return user;
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to add user' };
    }
  }
}
