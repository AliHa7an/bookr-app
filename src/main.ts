import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser";
import { ConfigService } from '@nestjs/config';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
import { DatabaseConfigService } from './database/database.config';
import { DataSource } from 'typeorm';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (request && request.url && response.status) {
      Logger.error(exception);
      Logger.error(`URL: ${request.url}`);
      response.status(500).send("Internal Server Error");
    }
  }
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  const port =
    configService.get<number>("APP_PORT") || configService.get<number>("PORT");

  const allowedCorsOrigins = configService.get<string>("CORS_ALLOWED_ORIGINS");
  app.enableCors({
    // origin: allowedCorsOrigins?.split(","),
    origin: "*",
    credentials: true,
  });

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/graphql", graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 20 }))


  await app.listen(port || 3000);
}

bootstrap();
