import { CoffeeType } from './../../ratings/domain/coffee-type';
import { Controller, Get } from "@nestjs/common";
import { RecommendationService } from "../domain";

@Controller('recommendation')
export class RecommendationController {

    constructor(private readonly recommendationService: RecommendationService) { }

    @Get()
    mostRecentRatingOfCoffeeType() {
        return this.recommendationService.calculateCoffeeTypeRecommendation();
    }
}

export type recommendationFoundDto = {
    coffeeType: string;
};
