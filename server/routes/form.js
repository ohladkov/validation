const express = require('express');
const multer = require('multer');

const formData = require('~server/form.json');
const { uploadsDir } = require('~root/config');
const { createFolder, getFileFieldData } = require('~server/helpers');

createFolder(uploadsDir);

const fileFields = getFileFieldData(formData);

const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', (req, res) => {
  res.render('form', { title: 'Form Page', formData });
});

router.post('/submit', upload.fields(fileFields), (req, res) => {
  res.send({ success: true });
});

module.exports = router;
