import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisService } from 'src/external/redis.service';

@Module({
  providers: [
    UserService, 
    PrismaService, 
    RedisService
  ],
  controllers: [
    UserController
  ],
})

export class UserModule { }
