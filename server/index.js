const express = require('express');
const multer = require('multer');

const PORT = 8081;
const UPLOAD_DIR = './uploads/';

const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/form', upload.single('attachment'), (req, res) => {
  res.send({ success: true });
});

app.listen(PORT);
