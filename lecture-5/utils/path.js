const path = require('path');

module.exports.rootDir1 = require.main.path;
module.exports.rootDir2 = path.dirname(require.main.filename);