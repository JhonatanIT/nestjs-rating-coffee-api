import { CoffeeType } from './coffee-type';

export type Rating = {
  coffeeType: CoffeeType;
  stars: {
    given: number;
    max: number;
  };
};
