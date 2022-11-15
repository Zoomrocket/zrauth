import { Module } from '@nestjs/common';
import { ExternalModule } from './external/external.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { SecurityModule } from './security/security.module';
import { UtilsModule } from './utils/utils.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ExternalModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    SecurityModule,
    UtilsModule,
    AdminModule
  ],
})
export class AppModule { }
