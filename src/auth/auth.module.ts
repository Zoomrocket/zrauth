import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { RedisService } from 'src/external/redis.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [PrismaService, AuthService, RedisService],
  controllers: [AuthController],
})
export class AuthModule {}
