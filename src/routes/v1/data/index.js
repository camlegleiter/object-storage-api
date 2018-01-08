import { Router } from 'express';

import createGetObjectHandler from './getObject';
import createPutObjectHandler from './putObject';

import { fsManager } from '../../../managers';

const getObject = createGetObjectHandler({ fsManager });
const putObject = createPutObjectHandler({ fsManager });

const routes = new Router();

routes.get('/*', getObject);
routes.put('/*', putObject);

export default routes;
