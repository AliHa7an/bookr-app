import { ConfigService } from '@nestjs/config';
import * as dotenv from "dotenv";
import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}
  
  getTypeOrmConfig(): DataSourceOptions {
    let dbConfig = this.configService.get<{ password: string, host: string, port: number, username: string, database: string }>('database');
    
    if (!dbConfig) {
      dbConfig.password = process.env.DB_PASSWORD;
      dbConfig.host = process.env.DB_HOST;
      dbConfig.port = parseInt(process.env.DB_PORT, 10) ?? 5432 ;
      dbConfig.username =  process.env.DB_USERNAME;
      dbConfig.database =  process.env.DB_NAME;
    }

    return {
      type: 'postgres',
      ...dbConfig,
      schema: 'public',
      ssl: true,
      migrationsRun: false,
      logging: ['error', 'schema'],
      entities: [`${__dirname}/../**/*.entity.{ts,js}`], 
      migrations: [`${__dirname}/../**/migrations/*.{ts,js}`], 
      synchronize: true, 
      
    };
  }
}
