import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { MongooseModule } from '@nestjs/mongoose';
import {  ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    CitiesModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/challenge'),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5
    }),
  ],
})
export class AppModule {}
