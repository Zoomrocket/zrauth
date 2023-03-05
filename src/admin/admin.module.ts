import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { RedisService } from 'src/external/redis.service';
import { OrganizationService } from 'src/organization/organization.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [PrismaService, OrganizationService, RedisService],
  controllers: [AdminController],
})
export class AdminModule {}
