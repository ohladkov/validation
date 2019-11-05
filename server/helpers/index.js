const fs = require('fs');
const path = require('path');

const createFolder = (folderPath) => {
  const rootPath = path.dirname(require.main.filename);

  if (!fs.existsSync(path.join(rootPath, folderPath))) {
    return fs.mkdirSync(path.join(rootPath, folderPath));
  }

  return folderPath;
};

const getFileFieldData = (formData) => {
  const fileNames = formData.fields.reduce((acc, current) => {
    const isFile = current.type === 'file';

    if (isFile) {
      const obj = {};

      obj.name = current.id;

      acc.push(obj);
    }

    return acc;
  }, []);

  return fileNames;
};

module.exports = {
  createFolder,
  getFileFieldData,
};
