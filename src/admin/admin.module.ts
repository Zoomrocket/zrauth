import { Module } from '@nestjs/common';
import { MailerService } from 'src/external/mailer.service';
import { PrismaService } from 'src/external/prisma.service';
import { RedisService } from 'src/external/redis.service';
import { OrganizationService } from 'src/organization/organization.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [PrismaService, OrganizationService, RedisService, MailerService],
  controllers: [AdminController],
})
export class AdminModule {}
