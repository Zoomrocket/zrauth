import { Module } from '@nestjs/common';
import { ExternalModule } from './external/external.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { SecurityModule } from './security/security.module';
import { UtilsModule } from './utils/utils.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.getOrThrow('SMTP_HOST'),
            port: config.getOrThrow('SMTP_PORT'),
            secure: true,
            requireTLS: true,
            auth: {
              user: config.getOrThrow('SMTP_USER'),
              pass: config.getOrThrow('SMTP_PASS'),
            },
          },
          defaults: {
            from: `'${config.getOrThrow(
              'SMTP_FROM_NAME',
            )}' <${config.getOrThrow('SMTP_FROM_MAIL')}>`,
          },
        };
      },
    }),
    ExternalModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    SecurityModule,
    UtilsModule,
    AdminModule,
  ],
})
export class AppModule {}
