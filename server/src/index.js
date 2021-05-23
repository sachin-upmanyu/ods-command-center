const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { router } = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan('tiny'));

app.use('/api', router);

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/*', (req,res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

app.use((err, req, res, next) => {
  console.log(res.statusCode, err);
  if (res.statusCode == 400) {
    res.json({ error: true, message: 'Bad Request' });
    return;
  }
  res.status(500).json({ error: true, message: 'something went wrong' });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3009;
}

app.listen(port, () => {
  console.log('up and running', port);
});
