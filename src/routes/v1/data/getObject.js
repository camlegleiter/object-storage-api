// import crypto from 'crypto';
import d from 'debug';
import { BadRequest } from 'throw.js';

const debug = d('objectstorage:data:getobject');

export default function createGetObjectHandler() {
  return async (req, res, next) => {
    // console.log(req.originalUrl); // /v1/data/path/to/file.ext
    // console.log(req.baseUrl); // /v1/data
    // console.log(req.path); // /path/to/file.ext

    /*
     Possible things to do:
     - Validation
       - Handle "." and ".." in path
       - Handle dotfiles
     - Return file
     - Return metadata
     - Versioning?
     - Checksum/ETag
     */

    const { path } = req;
    if (path === '' || path === '/') {
      next(new BadRequest('Objects must have a key name between 1 and 1024 bytes'));
      return;
    }

    res.sendFile(path, {
      dotfiles: 'allow',
      root: req.config.dataRoot,
    }, (err) => {
      if (err) {
        debug(err);
        next(err);
      }
    });
  };
}
