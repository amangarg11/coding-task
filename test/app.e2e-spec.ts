import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET Not Match)', () => {
    return request(app.getHttpServer())
      .get('/cities/suggestions?q=SomeRandomCityInTheMiddleOfNowhere')
      .expect(200)
      .expect({
        "suggestions": []
        });
  });

  it('/ (GET Match)', () => {
    return request(app.getHttpServer())
      .get('/cities/suggestions?sort=distance&latitude=43.700&longitude=-79.41&radius=5')
      .expect(200)
      .expect({
        "suggestions": [
            {
                "name": "Toronto",
                "latitude": 43.70011,
                "longitude": -79.4163,
                "distance": "0.51"
            }
        ]
    });
  });
});
