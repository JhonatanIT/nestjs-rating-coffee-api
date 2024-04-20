import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ratingDto } from './fixtures';

describe('GET /ratings/coffee-types', () => {
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

  it('there are rated coffee types taken from ratings given before', async () => {
    await makeHttpRequest()
      .post('/ratings')
      .send(ratingDto({ coffeeType: 'espresso' }));
    await makeHttpRequest()
      .post('/ratings')
      .send(ratingDto({ coffeeType: 'Kenyan, drip' }));

    await makeHttpRequest()
      .get('/ratings/coffee-types')
      .expect(200)
      .expect((res) => {
        expect(res.body).toContain('Kenyan, drip');
        expect(res.body).toContain('espresso');
      });
  });
});
