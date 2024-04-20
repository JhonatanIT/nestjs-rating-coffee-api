import { RatingDto } from '../ratings/http/ratings.controller';

export function ratingDto(overrides?: Partial<RatingDto>): RatingDto {
  return {
    coffeeType: 'any coffee type',
    starRating: '1/5',
    ...overrides,
  };
}
