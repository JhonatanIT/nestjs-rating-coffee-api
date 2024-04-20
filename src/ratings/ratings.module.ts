import { Module } from '@nestjs/common';
import { RatingsController } from './http';
import { RatingsService } from './domain';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule { }
