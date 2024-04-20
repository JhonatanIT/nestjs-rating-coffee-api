import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ratingDto } from './fixtures';

describe('GET /ratings', () => {
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

  it('rating of given coffee type can be obtained', async () => {
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'Kenyan, drip',
          starRating: '4/5',
        }),
      );

    await makeHttpRequest()
      .get('/ratings')
      .query({ coffeeType: 'Kenyan, drip' })
      .expect(200)
      .expect({
        coffeeType: 'Kenyan, drip',
        starRating: '4/5',
      });
  });

  it('obtained rating of given coffee type is the most recent one', async () => {
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'Kenyan, drip',
          starRating: '4/5',
        }),
      );
    await makeHttpRequest()
      .post('/ratings')
      .send(
        ratingDto({
          coffeeType: 'Kenyan, drip',
          starRating: '3/5',
        }),
      );

    await makeHttpRequest()
      .get('/ratings')
      .query({ coffeeType: 'Kenyan, drip' })
      .expect(200)
      .expect({
        coffeeType: 'Kenyan, drip',
        starRating: '3/5',
      });
  });

  it('400 Bad Request is returned if asked for coffee type that was not rated yet', async () => {
    await makeHttpRequest()
      .get('/ratings')
      .query({ coffeeType: 'not rated coffee type' })
      .expect(400);
  });
});
