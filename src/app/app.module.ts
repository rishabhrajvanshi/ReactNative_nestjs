/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController, VerifyController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    MongooseModule.forRoot(process.env.MONGO_URI, {
      // useful options (mongoose v6 has sensible defaults)
      // autoIndex: true, // only enable in dev
      // keepAlive: true,
      // serverSelectionTimeoutMS: 5000,
    }),
    CacheModule.registerAsync({
      isGlobal: true, // so you can inject CACHE_MANAGER anywhere
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
          // password: 'your_redis_password', // if using auth
        }),
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController, AuthController, VerifyController],
  providers: [AppService],
})
export class AppModule { }
