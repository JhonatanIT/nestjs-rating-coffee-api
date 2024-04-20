import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Rating } from "./rating";
import { RatingDto } from "../http/ratings.controller";
import { CoffeeType } from "./coffee-type";

@Injectable()
export class RatingsService {

    private readonly _ratingList: RatingDto[] = [];

    findLastByCoffeeType(coffeeType: CoffeeType): RatingDto {

        if (!coffeeType) throw new BadRequestException('coffeeType has to be present in the URL');
        const ratingListByCoffeeType = this._ratingList.filter(x => x.coffeeType === coffeeType);

        if (!ratingListByCoffeeType.length) throw new BadRequestException({ "coffeeType": "not rated yet coffee type taken from query param" });

        //Get last rating
        return ratingListByCoffeeType[ratingListByCoffeeType.length - 1];
    }

    getAllCoffeeTypeRatings(): RatingDto[] {
        return this._ratingList;
    }

    findAllDistinctCoffeTypes(): CoffeeType[] {
        const coffeeTypeList: CoffeeType[] = this._ratingList.map(x => x.coffeeType);

        //Use Set to delete duplicates
        return Array.from(new Set<CoffeeType>(coffeeTypeList));
    }

    create(ratingDto: RatingDto): RatingDto {

        if (!ratingDto.coffeeType) throw new BadRequestException('coffeeType Not Found')
        if (!ratingDto.starRating) throw new BadRequestException('starRating Not Found')

        const list: string[] = ratingDto.starRating.split("/");
        if (!list.length
            || typeof +list[0] !== 'number'
            || typeof +list[1] !== 'number'
            || +list[0] < 1
            || +list[0] > 5
            || +list[1] !== 5) throw new BadRequestException('starRating wrong')

        this._ratingList.push(ratingDto);

        return ratingDto
    }

}
