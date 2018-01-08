import config from 'config';
import errors from 'throw.js';

import createGetObjectHandler from '../../../../src/routes/v1/data/getObject';

describe('createGetObjectHandler', () => {
  let req;
  let res;
  let next;

  let stream;

  let fsManager;
  let handler;

  beforeEach(() => {
    req = {
      config,
      pipe: jest.fn(),
    };
    res = {
      end: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    stream = {
      on: jest.fn().mockReturnThis(),
    };
    fsManager = {
      createObjectWriteStream: jest.fn(async () => stream),
    };
    handler = createGetObjectHandler({ fsManager });
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

  // describe('on failure', () => {
  //   describe('when the write stream fails', () => {
  //     const err = new Error('BOOM!');

  //     beforeEach(async () => {
  //       stream.on.mockImplementation((event, cb) => {
  //         if (event === 'error') {
  //           cb(err);
  //         }
  //       });

  //       req.path = '/foo/bar/baz.txt';
  //       await handler(req, res, next);
  //     });

  //     it('calls next() with a 5XX error', () => {
  //       expect(next).toBeCalledWith(expect.any(errors.InternalServerError));
  //     });
  //   });
  // });

  // describe('on success', () => {
  //   beforeEach(async () => {
  //     stream.on.mockImplementation((event, cb) => {
  //       if (event === 'finish') {
  //         cb();
  //       }
  //     });

  //     req.path = '/foo/bar/baz.txt';
  //     await handler(req, res, next);
  //   });

  //   it('returns a 201 response', () => {
  //     expect(res.status).toBeCalledWith(201);
  //     expect(res.end).toBeCalled();
  //   });
  // });
});
