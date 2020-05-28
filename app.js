'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config')
const path = require('path')
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const {Schema, model, Types} = require('mongoose')
const cors = require('cors')
const assign = Object.assign;

const userSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  login: String,
  password: String,
  isAdmin: Boolean,
});
const User = mongoose.model('User', userSchema);

const robotSchema = new Schema({
  name: String,
  description: String,
  type: String,
  popularity: Number,
  program: String,
  robotImage: String,
  programImage: String,
  instruction: String,
  createdAt: String,
  hasProgram:Boolean
});
const Robot = mongoose.model('Robot', robotSchema);

const instructionSchema = new Schema({
  name: String,
  type: String,
  file: String,
  robotImage: String,
});
const Instruction = mongoose.model('Instruction', instructionSchema);

const programSchema = new Schema({
  name: String,
  type: String,
  file: String,
});
const Program = mongoose.model('Program', programSchema);

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
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


app.post('/api/users',
  [
    check('user.email', 'Некорректный email').isEmail(),
    check('user.password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.send(errors)
      }

      const {email, password, name, surname, login, isAdmin} = req.body.user
      const candidate = await User.findOne({ email:email })

      if (candidate) {
        res.send({errors: {msg: 'Такой пользователь уже существует'}})
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword, name, surname, login, isAdmin:false })
      await user.save()
      res.send({users: {id: user._id}})

      console.log('Пользователь создан');

    } catch (e) {
      res.send({errors: {msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })


  app.post('/api/login',
    async (req, res) => {
    try {

      const login = req.body.username
      const password = req.body.password
      const user = await User.findOne({ login:login })
      if(user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          res.status(400).send({error:"Неправильно введен логин или пароль"})
        }
      } else {
        res.status(400).send({error:"Неправильно введен логин или пароль"})
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )
      res.status(200).json({
          access_token:token,
          token_type:"bearer",
          user:{
            _id: user._id,
            name:user.name,
            surname:user.surname,
            isAdmin: user.isAdmin,
            login: user.login,
          }
      })
      console.log("Вход на сайт прошел успешно");

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })


  // app.post('/api/users/:id',
  //   async (req, res) => {
  //   try {
  //     console.log(req);
  //     const userId = req.body.userId
  //     const user = await User.findOne({ _id:userId })
  //
  //     res.send({
  //       users: {
  //         id: user._id,
  //       }
  //     })
  //     console.log("Отправлены данные текущего пользователя");
  //
  //   } catch (e) {
  //     res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
  //   }
  // })


  app.get('/api/robots', async (req, res) => {
    try {

      const filter = req.body.data.attributes.filter

      const robots = await Robot.find({ filter })

      res.send({
        robots: {

        }
      })

      console.log('Найдены постройки');

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })


  app.get('/api/robots:id', async (req, res) => {
    try {

      const filter = req.body.data.attributes.filter

      const robot = await Robot.findOne({ _id: filter._id })

      res.send({
        robots: {
          id: robot._id
        }
      })

      console.log('Найдена постройка: ' + robot._id);

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })


  app.post('/api/robots', async (req, res) => {
    try {

      console.log(req.body);
      const robot = null;
      const createdAt = moment.utc().toISOString()
      const {name, description, type, hasProgram, instruction, robotImage, program, programImage} = req.body.robot
      if(hasProgram) {
        const { program, programImage } = req.body.robot
        const robotCandidate = new Robot({name, description, type, hasProgram, createdAt, instruction, robotImage, program, programImage})
        robot = robotCandidate
      } else {
        const robotCandidate = new Robot({name, description, type, hasProgram, createdAt, instruction, robotImage})
        robot = robotCandidate
      }
      await robot.save()
      res.send({
        robots: {
          id: robot._id
        }
      })

      console.log('Добавлена постройка: '  + robot._id);

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

start()
