import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { RatingDto } from './ratings.controller';
import { Rating } from '../domain';

export class ParseRatingPipe implements PipeTransform<RatingDto, Rating> {
  transform(ratingDto: RatingDto, metadata: ArgumentMetadata): Rating {
    return {
      coffeeType: ratingDto.coffeeType,
      stars: {
        given: +ratingDto.starRating.split("/")[0],
        max: +ratingDto.starRating.split("/")[1],
      },
    };
  }
}
