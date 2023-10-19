const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cryptojs = require('crypto-js');
const secretKey = "/nm8z3}KkeXVpsL";

const usersRouter = require('./routes/users');
const solvesRouter = require('./routes/solves');
const roomsRouter = require('./routes/rooms');
const partiesRouter = require('./routes/parties');
const cubesRouter = require('./routes/cubes');

var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
console.log(process.env.DB_URI);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log('Mongoose connection successful!'))
  .catch((err) => console.error(err));

const db = mongoose.connection;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors({
//   // origin: ['http://localhost:4200', 'https://davidmartinezmerencioalixar.github.io'],
//   origin: '*',
//   allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));
app.use(cors());
app.use((req, res, next) => {
  for (const field in req.body) {
    const fieldValue = req.body[field];
    const isCryptoJSEncryptedField = /^U2FsdGVkX1/.test(fieldValue);
    if (isCryptoJSEncryptedField) {
      const decryptedBytes = cryptojs.AES.decrypt(fieldValue, secretKey);
      const decryptedValue = decryptedBytes.toString(cryptojs.enc.Utf8);
      req.body[field] = decryptedValue;
    }
  }
  next();
});

app.use('/users', usersRouter);
app.use('/solves', solvesRouter);
app.use('/rooms', roomsRouter);
app.use('/parties', partiesRouter);
app.use('/cubes', cubesRouter);

module.exports = app;