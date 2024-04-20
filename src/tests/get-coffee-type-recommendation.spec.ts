import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ratingDto } from './fixtures';

const starRatingTooLowToBeRecommended = '3/5';
const starRatingHighEnoughToBeRecommended = '4/5';
const starRatingHighestPossible = '5/5';

describe('GET /recommendation', () => {
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

  it('recently rated coffee type is not considered a recommendation', async () => {
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'espresso',
          starRating: starRatingTooLowToBeRecommended,
        }),
      );
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'recently rated coffee type',
          starRating: starRatingHighEnoughToBeRecommended,
        }),
      );

    await makeHttpRequest()
      .get('/recommendation')
      .expect(200)
      .expect({ message: 'NO_RECOMMENDATIONS_AVAILABLE' });
  });

  ['5/5', '4/5'].forEach((starRating) => {
    it(`coffee type rated ${starRating} can be recommended`, async () => {
      await makeHttpRequest()
        .post('/ratings')
        .send(
          ratingDto({
            coffeeType: 'Kenyan, drip',
            starRating: starRating,
          }),
        );
      await makeHttpRequest()
        .post('/ratings')
        .send(ratingDto({ coffeeType: 'recently rated coffee type' }));

      await makeHttpRequest()
        .get('/recommendation')
        .expect(200)
        .expect({ coffeeType: 'Kenyan, drip' });
    });
  });

  it('from coffee types rated high enough the one rated oldest is recommended', async () => {
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'coffee type rated first',
          starRating: starRatingHighEnoughToBeRecommended,
        }),
      );
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'coffee type rated second',
          starRating: starRatingHighEnoughToBeRecommended,
        }),
      );
    await makeHttpRequest()
      .post('/ratings')
      .send(ratingDto({ coffeeType: 'recently rated coffee type' }));

    await makeHttpRequest()
      .get('/recommendation')
      .expect(200)
      .expect({ coffeeType: 'coffee type rated first' });
  });
});
