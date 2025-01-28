import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
} from "@nestjs/typeorm";

import { DatabaseConfigService } from "./database.config";

export const TypeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const databaseConfigService = new DatabaseConfigService(configService);
    return databaseConfigService.getTypeOrmConfig();
  },
};
