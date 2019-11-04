const fs = require('fs');
const path = require('path');

const createFolder = (folderPath) => {
  const rootPath = path.dirname(require.main.filename);

  if (!fs.existsSync(path.join(rootPath, folderPath))) {
    return fs.mkdirSync(path.join(rootPath, folderPath));
  }

  return folderPath;
};

module.exports = { createFolder };
