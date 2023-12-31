import { Module } from '@nestjs/common';

import { AuthModule } from './auth/infrastructure/auth.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';

@Module({
  imports: [EnvConfigModule, UserModule, DatabaseModule, AuthModule],
})
export class AppModule {}
