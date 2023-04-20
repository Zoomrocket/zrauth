import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  Get,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { OrganizationService } from 'src/organization/organization.service';
import { AdminGuard } from 'src/security/admin.guard';
import {
  AddUserOrgDto,
  ChangeEmailDto,
  EditOrgDto,
  InviteUserOrgDto,
  updateUserOrgDto,
} from './admin.dto';
import { UserService } from 'src/user/user.service';

@UseGuards(AdminGuard)
@Controller('/v1/admin')
export class AdminController {
  constructor(
    private readonly _organizationService: OrganizationService,
    private readonly _userService: UserService,
  ) {}

  @Put('/users/change-email')
  async putUserEmail(@Body() body: ChangeEmailDto, @Res() res: Response) {
    try {
      if (body.existing_email !== body.new_email) {
        await this._userService.changeEmailAddress(
          body.existing_email,
          body.new_email,
        );
      }
      return { detail: 'updated' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to change email' };
    }
  }

  @Put('/organizations')
  async putOrganization(@Body() body: EditOrgDto, @Res() res: Response) {
    try {
      await this._organizationService.editOrganization(
        body.id,
        body.name,
        body.organizationData,
      );
      return { detail: 'updated' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to fetch organizations' };
    }
  }

  @Get('/organizations')
  async getOrganizations(@Res() res: Response) {
    try {
      let result = await this._organizationService.fetchAllOrganizations();
      return result;
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to fetch organizations' };
    }
  }

  @Get('/users')
  async getUsers(@Res() res: Response) {
    try {
      let result = await this._userService.getAllUsers();
      return result;
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to fetch users' };
    }
  }

  @Delete('/users/:uid')
  async deleteUser(@Param() params: any, @Res() res: Response) {
    try {
      await this._userService.deleteUser(params.uid);
      return { detail: 'deleted' };
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to delete user' };
    }
  }

  @Delete('/organizations/:oid/users/:uid')
  async removeUserFromOrganization(@Param() params: any, @Res() res: Response) {
    try {
      await this._organizationService.leaveOrganization(params.uid, params.oid);
      return { detail: 'deleted' };
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to delete user' };
    }
  }

  @Get('/organizations/:oid/users')
  async getOrganizationUsers(@Param() params: any, @Res() res: Response) {
    try {
      let result = await this._organizationService.fetchOrganizationUsers(
        params.oid,
      );
      return result;
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to fetch organizations' };
    }
  }

  @Delete('/organizations/:oid')
  async deleteOrganization(@Param() params: any, @Res() res: Response) {
    try {
      await this._organizationService.deleteOrganization(params.oid);
      return { detail: 'deleted' };
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to delete organization' };
    }
  }

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
        body?.extra_profile_data || {},
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
