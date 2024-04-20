import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ratingDto } from './fixtures';

describe('POST /ratings', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  function makeHttpRequest() {
    return request(app.getHttpServer());
  }

  ['1/5', '4/5'].forEach((starRating) => {
    it(`coffee type can be rated with number of stars out of 5 (case: "${starRating}")`, async () => {
      await makeHttpRequest()
        .post('/ratings')
        .send(
          ratingDto({
            coffeeType: 'espresso',
            starRating: starRating,
          }),
        )
        .expect(201);
    });
  });

  ['6/5', '11/5'].forEach((tooHighStarRating) => {
    it(`star rating cannot be higher than 5 out of 5 (case: "${tooHighStarRating}")`, async () => {
      await makeHttpRequest()
        .post('/ratings')
        .send(
          ratingDto({
            starRating: tooHighStarRating,
          }),
        )
        .expect(400);
    });
  });

  it('400 Bad Request is returned if star rating is not provided', async () => {
    const { starRating, ...invalidRatingDto } = ratingDto();
    await makeHttpRequest()
      .post('/ratings')
      .send(invalidRatingDto)
      .expect(400);
  });
});
