import { Module } from '@nestjs/common';
import { MailerService } from 'src/external/mailer.service';
import { PrismaService } from 'src/external/prisma.service';
import { RedisService } from 'src/external/redis.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  providers: [OrganizationService, PrismaService, RedisService, MailerService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
