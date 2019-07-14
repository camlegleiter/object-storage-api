const config = require('config');
const { PassThrough, Readable } = require('stream');
const errors = require('throw.js');

const createPutObjectHandler = require('../../../../src/routes/v1/data/putObject');

describe('createPutObjectHandler', () => {
  const objectContents = 'Hello, World!';

  let req;
  let res;
  let next;

  let stream;

  let fsManager;
  let handler;

  beforeEach(() => {
    req = new Readable({
      read() {},
    });
    req.path = '/foo/bar/baz.txt';
    req.config = config;

    res = {
      end: jest.fn().mockName('end'),
      writeHead: jest.fn().mockName('writeHead'),
    };
    next = jest.fn();

    stream = new PassThrough();
    fsManager = {
      createObjectWriteStream: jest.fn(async () => stream),
    };
    handler = createPutObjectHandler({ fsManager });
  });

  describe('validating the key name', () => {
    describe('when the key name is empty', () => {
      it('calls next() with an error', async () => {
        req.path = '';
        await handler(req, res, next);

        expect(next).toBeCalledWith(expect.any(errors.BadRequest));
      });
    });
  });

  describe('on failure', () => {
    describe('when the write stream fails', () => {
      const err = new Error('BOOM!');

      beforeEach(async () => {
        await handler(req, res, next);
        stream.emit('error', err);
      });

      it('calls next() with a 5XX error', () => {
        expect(next).toBeCalledWith(expect.any(errors.InternalServerError));
      });
    });
  });

  describe('on success', () => {
    beforeEach(async () => {
      await handler(req, res, next);

      req.push(objectContents);
      req.push(null);
    });

    it('returns a 201 response', (done) => {
      stream.on('finish', () => {
        expect(res.writeHead).toBeCalledWith(201, {
          ETag: '65a8e27d8879283831b664bd8b7f0ad4',
        });
        expect(res.end).toBeCalled();
        done();
      });
    });
  });
});
