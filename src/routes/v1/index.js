import { Router } from 'express';

import data from './data';

const v1 = Router();

v1.use('/data', data);

export default v1;
