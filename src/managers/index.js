/* eslint-disable import/prefer-default-export */
import * as fs from 'fs-extra';

import createFsManager from './fsManager';

export const fsManager = createFsManager({ fs });
