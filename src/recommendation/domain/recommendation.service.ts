import { Injectable } from '@nestjs/common';
import { CoffeeType } from '../../ratings';
import { RatingDto } from 'src/ratings/http/ratings.controller';
@Injectable()
export class RecommendationService {

  private readonly NO_RECOMMENDATIONS_AVAILABLE = { message: "NO_RECOMMENDATIONS_AVAILABLE" };

  async calculateCoffeeTypeRecommendation() {

    //GET /ratings/all
    const response = await fetch('http://localhost:3000/ratings/all');
    const data: RatingDto[] = await response.json();

    if (!data) return this.NO_RECOMMENDATIONS_AVAILABLE;

    //Most recently rated coffee type is not included
    data.pop();

    //Coffee types rated with 4 stars or more
    const possibleRecommendations = data.filter(x => +x.starRating.split("/")[0] >= 4);
    if (!possibleRecommendations.length) return this.NO_RECOMMENDATIONS_AVAILABLE;

    //The oldest rated
    const coffeeType: CoffeeType = possibleRecommendations[0].coffeeType;

    return { coffeeType };
  }
}

type RatingResponse = {
  data: RatingDto[];
};