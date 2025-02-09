import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkspaceModule } from './workspace/workspace.module';

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot(),
//     MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // @ts-ignore
        uri: config.get<string>("MONGO_CONNECTION_STRING")
      })
    }),
    UserModule,
    AuthModule,
    WorkspaceModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}