import config from 'config';
import fs from 'fs-extra';
import path from 'path';
import supertest from 'supertest';

import app from '../../../../src/app';

describe('/v1/data', () => {
  let request;

  beforeAll(() => {
    request = supertest(app);
  });

  describe('GET', () => {
    describe('validation', () => {
      it('responds with a 400 when no key is specified in the path', async () => {
        await request.get('/v1/data').expect(400);
      });
    });

    describe('retrieving an object', () => {
      const fileContents = 'Hello, World!\n';
      let fileName;

      beforeEach(async () => {
        fileName = `test-file-${Date.now()}.txt`;

        await request.put(`/v1/data/${fileName}`)
          .type('text/plain')
          .send(fileContents);
      });

      afterEach(async () => {
        await fs.unlink(path.join(config.get('dataRoot'), fileName));
      });

      it('responds with a 200 on success', async () => {
        await request.get(`/v1/data/${fileName}`).expect(200);
      });

      it('returns the full object', async () => {
        await request.get(`/v1/data/${fileName}`)
          .then((res) => {
            expect(res.text).toBe(fileContents);
          });
      });

      describe('getting a partial object', () => {
        const start = 0;
        const end = 4;

        it('responds with a 206', async () => {
          await request.get(`/v1/data/${fileName}`)
            .set('range', `bytes=${start}-${end}`)
            .expect(206);
        });

        it('returns the range requested', async () => {
          const expectedContent = fileContents.substr(start, end + 1);

          await request.get(`/v1/data/${fileName}`)
            .set('range', `bytes=${start}-${end}`)
            .then((res) => {
              expect(res.text).toBe(expectedContent);
              expect(res.headers['content-range']).toBe(`bytes ${start}-${end}/${fileContents.length}`);
            });
        });
      });
    });
  });

  describe('PUT', () => {
    describe('validation', () => {
      it('responds with a 400 when no key is specified in the path', async () => {
        await request.put('/v1/data').expect(400);
      });
    });

    describe('sending the request with file contents', () => {
      const fileContents = 'Hello, World!\n';
      let fileName;

      beforeEach(() => {
        fileName = `test-file-${Date.now()}.txt`;
      });

      afterEach(async () => {
        await fs.unlink(path.join(config.get('dataRoot'), fileName));
      });

      it('responds with a 201', async () => {
        await request.put(`/v1/data/${fileName}`)
          .type('text/plain')
          .send(fileContents)
          .expect(201);
      });
    });
  });
});
