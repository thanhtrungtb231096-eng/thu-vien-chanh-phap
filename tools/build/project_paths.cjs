const path = require('node:path');
const organized = path.basename(__dirname) === 'build';
const root = path.resolve(__dirname, organized ? '../..' : '..');
module.exports = {
  root,
  web: path.join(root, organized ? 'app/web' : 'web-thuvien'),
  dependencies: path.join(root, organized ? 'local/runtime/python' : '.runtime'),
  cache: path.join(root, organized ? 'local/storage/cache/work' : '.runtime-cache'),
};
