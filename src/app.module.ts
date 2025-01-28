import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';
import { OriginalError } from './types/graphql-type-error.type';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ShopsModule } from './shops/shops.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmAsyncConfig } from './database/typeorm.config';
import { EmailService } from './email-service/email-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig] }),
    AuthModule,
    UserModule,
    ServiceCategoriesModule,
    ShopsModule,
    TypeOrmModule.forRootAsync(TypeOrmAsyncConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      context: async ({ req }) => {
        return req;
      },
      //   resolvers: {
      //     JSON: GraphQLJSON
      //  },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (formattedError: GraphQLError, error) => {
        if (
          formattedError.extensions?.code ===
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
          return { ...formattedError };
        }

        if (
          formattedError.extensions?.code ===
            ApolloServerErrorCode.BAD_REQUEST &&
          formattedError.extensions?.originalError
        ) {
          const originalError = formattedError.extensions
            ?.originalError as unknown as OriginalError;
          const { message, statusCode, error } = originalError;
          const { constraints, property, value } = message[0];
          return {
            ...formattedError,
            message: constraints,
            property,
            value,
            status: statusCode,
            error,
            extensions: {
              ...formattedError.extensions,
            },
          };
        }
        const parsedMessage = formattedError.message;
        return { ...formattedError, formatted: parsedMessage };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
