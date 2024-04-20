import { Module } from '@nestjs/common';
import { RatingsModule } from './ratings';
import { AppController } from './app.controller';
import { RecommendationModule } from './recommendation';

@Module({
  imports: [RatingsModule, RecommendationModule],
  controllers: [AppController],
})
export class AppModule { }
