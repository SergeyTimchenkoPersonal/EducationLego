'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config')
const path = require('path')
const { MongoClient, ObjectId } = require('mongodb');

const assign = Object.assign;

const app = express()

app.use('/api/auth', require('./routes/auth.routes'))

app.use(express.json({ extended: true }))

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
