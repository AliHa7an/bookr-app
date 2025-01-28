import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfigService } from "./database.config";
 
const configService = new ConfigService(); 

const databaseConfigService = new DatabaseConfigService(configService);

const databaseConfig = databaseConfigService.getTypeOrmConfig();

export const AppDataSource = new DataSource(databaseConfig);
