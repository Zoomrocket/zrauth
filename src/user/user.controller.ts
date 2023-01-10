import {
  Controller,
  Put,
  UseGuards,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/security/auth.guard';
import { UpdatePasswordDto } from './user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('/v1/users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Put('/me/update-password')
  async putPassword(@Body() body: UpdatePasswordDto, @Res() res: Response) {
    try {
      await this._userService.updatePassword(
        res.locals.user['user_id'],
        body.current,
        body.update,
      );
      return { detail: 'password updated' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to update password' };
    }
  }

  @Put('/me/update-profile')
  async putProfile(@Body() body: UpdatePasswordDto, @Res() res: Response) {
    try {
      await this._userService.updatePassword(
        res.locals.user['user_id'],
        body.current,
        body.update,
      );
      return { detail: 'password updated' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to update password' };
    }
  }
}
