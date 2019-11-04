const express = require('express');
const multer = require('multer');

const formData = require('~server/form.json');
const { createFolder } = require('~server/helpers');
const { uploadsDir } = require('~root/config');

createFolder(uploadsDir);

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

router.post('/submit', upload.single('attachment'), (req, res) => {
  res.send({ success: true });
});


module.exports = router;
