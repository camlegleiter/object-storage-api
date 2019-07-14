const fs = require('fs-extra');

const createFsManager = require('./fsManager');

module.exports = {
  fsManager: createFsManager({ fs }),
};
