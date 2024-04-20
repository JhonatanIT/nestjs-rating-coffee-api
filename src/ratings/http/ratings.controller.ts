import { Rating, RatingsService } from '../domain';
import { CoffeeType } from './../domain/coffee-type';
import { BadRequestException, Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';

@Controller('ratings')
export class RatingsController {

  constructor(private readonly ratingsService: RatingsService) { }

  @Get()
  mostRecentRatingOfCoffeeType(@Query('coffeeType') coffeeType: CoffeeType): RatingDto {
    return this.ratingsService.findLastByCoffeeType(coffeeType);
  }

  @Get("/all")
  getAllCoffeeTypeRatings(): RatingDto[] {
    return this.ratingsService.getAllCoffeeTypeRatings();
  }

  @Get("coffee-types")
  listRatedCoffeeTypes(): CoffeeType[] {
    return this.ratingsService.findAllDistinctCoffeTypes();
  }

  @Post() // POST /users 
  create(@Body(ValidationPipe) ratingDto: RatingDto) {
    return this.ratingsService.create(ratingDto)
  }

}

export type RatingDto = {
  coffeeType: string;
  starRating: string;
};
