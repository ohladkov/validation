const express = require('express');
const multer = require('multer');

const PORT = 8081;

const upload = multer({ dest: './uploads/' });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/form', upload.single('attachment'), (req, res) => {
  res.send({ success: true });
});

app.listen(PORT);
