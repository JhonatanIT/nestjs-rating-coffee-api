import { Module } from '@nestjs/common';
import { RecommendationController } from './http';
import { RecommendationService } from './domain';

@Module({
    controllers: [RecommendationController],
    providers: [RecommendationService]
})
export class RecommendationModule { }
