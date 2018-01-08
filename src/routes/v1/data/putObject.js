import crypto from 'crypto';
import d from 'debug';
import { join } from 'path';
import { Transform } from 'stream';
import { BadRequest, InternalServerError } from 'throw.js';

const debug = d('objectstorage:data:putobject');

export default function createPutObjectHandler({ fsManager }) {
  return async (req, res, next) => {
    // console.log(req.originalUrl); // /v1/data/path/to/file.ext
    // console.log(req.baseUrl); // /v1/data
    // console.log(req.path); // /path/to/file.ext

    /*
     Possible things to do:
     - Validation
       - Handle "Expect: 100-continue" header behavior?
       - Content-Length check
       - Handle "." and ".." in path
       - Handle dotfiles
     - Write file
     - Write metadata
     - Partial Upload
     - Versioning?
     - Webhooks?
     - Checksum/ETag
     - Client abort
     */

    const { path } = req;
    if (path === '' || path === '/') {
      next(new BadRequest('Objects must have a key name between 1 and 1024 bytes'));
      return;
    }

    const hash = crypto.createHash('md5');
    const passThrough = new Transform({
      transform(chunk, encoding, cb) {
        hash.update(chunk);
        cb(null, chunk);
      },
    });

    const fileSystemPath = join(req.config.dataRoot, path);
    const stream = await fsManager.createObjectWriteStream(fileSystemPath);
    stream.on('error', (err) => {
      debug(err);
      next(new InternalServerError(`An error ocurred writing the object: ${err.message}`));
    });

    stream.on('finish', () => {
      const md5 = hash.digest('hex');
      res.writeHead(201, {
        ETag: md5,
      });
      res.end();
    });

    req.pipe(passThrough).pipe(stream);
  };
}
