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
const fs = require("fs");

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
  robotImageId: ObjectId,
  instructionId: ObjectId,
  hasProgram:Boolean,
  programId: ObjectId,
  programImageId: ObjectId,
  createdAt: String,
});
const Robot = mongoose.model('Robot', robotSchema);

const robotImageSchema = new Schema({
  name: String,
  type: String,
  filePath: String,
});
const RobotImage = mongoose.model('RobotImage', robotImageSchema);

const instructionSchema = new Schema({
  name: String,
  type: String,
  filePath: String,
});
const Instruction = mongoose.model('Instruction', instructionSchema);

const programSchema = new Schema({
  name: String,
  type: String,
  filePath: String,
});
const Program = mongoose.model('Program', programSchema);

const programImageSchema = new Schema({
  name: String,
  type: String,
  filePath: String,
});
const ProgramImage = mongoose.model('ProgramImage', programImageSchema);

const likeSchema = new Schema({
  userId: ObjectId,
  robotId: ObjectId,
});
const Like = mongoose.model('Like', likeSchema);

const app = express()

app.use(cors())
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
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
  async (req, res) => {
    try {

      const {email, password, name, surname, login, isAdmin} = req.body.user
      const candidate = await User.findOne({ email:email })

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword, name, surname, login, isAdmin:false })
      await user.save()
      res.send({users: user})

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
        { userId: user._id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )
      res.status(200).json({
          access_token:token,
          token_type:"bearer",
          user:{
            id: user._id,
            name:user.name,
            surname:user.surname,
            email: user.email,
            isAdmin: user.isAdmin,
            login: user.login,
          }
      })
      console.log("Вход на сайт прошел успешно");

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

  app.get('/api/robots', async (req, res) => {
    try {

      const userId = req.headers.userid
      const rawRobots = await Robot.find({})
      let robots = []
      await rawRobots.reduce(async (promise, i) => {
        await promise;
        const item = i.toObject()

        let popularity = await Like.find({robotId: item._id})
        if(!popularity) {
          popularity = 0;
        }

        item.popularity = popularity.length
        const isLiked = await Like.findOne({robotId: item._id, userId: userId})
        if(isLiked) {
          item.isLiked = true
          item.likeId = isLiked.id
        }

        const robotImage = await RobotImage.findOne({_id: item.robotImageId})
        item.robotImage = `http://localhost:${PORT}` + robotImage.filePath.split('public')[1].replace(/\\/g, '/')
        robots.push(item)
      }, Promise.resolve());

      res.send({robots: robots})

      console.log('Найдены постройки:', robots);
    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })


  app.get('/api/robots/:id', async (req, res) => {
    try {

      const rawRobot = await Robot.findOne({ _id: req.params.id })
      const robot = rawRobot.toObject()

      const robotImage = await RobotImage.findOne({ _id: robot.robotImageId })
      robot.robotImage = `http://localhost:${PORT}` + robotImage.filePath.split('public')[1].replace(/\\/g, '/')

      const instruction = await Instruction.findOne({ _id: robot.instructionId })
      robot.instruction = `http://localhost:${PORT}` + instruction.filePath.split('public')[1].replace(/\\/g, '/')

      if(robot.hasProgram) {
        const program = await Program.findOne({ _id: robot.programId })
        robot.program = `http://localhost:${PORT}` + program.filePath.split('public')[1].replace(/\\/g, '/')

        if(robot.programImage) {
          const programImage = await ProgramImage.findOne({ _id: robot.programImageId})
          robot.programImage = `http://localhost:${PORT}` + programImage.filePath.split('public')[1].replace(/\\/g, '/')
        }
      }
      res.send({robot: robot})

      console.log('Найдена постройка: ' + robot._id);

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

  app.post('/api/robots', async (req, res) => {
    try {

      const {name, description, type, hasProgram, instruction, robotImage, program, programImage} = req.body.robot
      const createdAt = moment.utc().toISOString()
      const fileName = moment().unix()
      let robot = null
      const candidate = await Robot.findOne({ name })
      if(candidate) {
        console.log('Постройка с таким именем уже существует');
        res.send({errors: {msg: 'Постройка с таким именем уже существует'}})
      } else {

        const robotImageExt = robotImage.split(';')[0].split('/')[1];
        let robotImageData = robotImage.split('base64,')[1];
        robotImageData = Buffer.from(robotImageData, "base64")
        const robotImagePath = path.normalize(path.join(__dirname, `public/${type}/robotImages/${fileName}.${robotImageExt}`))
        const newRobotImage = new RobotImage({ name, type, filePath: robotImagePath})
        await newRobotImage.save()
        fs.writeFile(robotImagePath, robotImageData, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log('The robotImage has been saved!');
        });

        const instructionExt = instruction.split(';')[0].split('/')[1];
        let instructionData = instruction.split('base64,')[1];
        instructionData = Buffer.from(instructionData, "base64")
        const instructionFilePath = path.normalize(path.join(__dirname, `public/${type}/instructions/${fileName}.${instructionExt}`))
        const newInstruction = new Instruction({ name, type, filePath: instructionFilePath})
        fs.writeFile(instructionFilePath, instructionData, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log('The instruction has been saved!');
        });
        await newInstruction.save()

        if(hasProgram) {
          let programData = program.split('base64,')[1];
          programData = Buffer.from(programData, "base64")
          const programFilePath = path.normalize(path.join(__dirname, `public/${type}/programs/${fileName}.${type}`))
          const newProgram = new Program({ name, type, filePath: programFilePath})
          fs.writeFile(programFilePath, programData, (err) => {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log('The program has been saved!');
          });
          await newProgram.save()

          let newProgramImage = null
          if (programImage) {
            const programImageExt = programImage.split(';')[0].split('/')[1];
            let programImageData = programImage.split('base64,')[1];
            programImageData = Buffer.from(programImageData, "base64")
            const programImageFilePath = path.normalize(path.join(__dirname, `public/${type}/programImages/${fileName}.${programImageExt}`))
            newProgramImage = new ProgramImage({ name, type, filePath: programImageFilePath})
            fs.writeFile(programImageFilePath, programImageData, (err) => {
              if (err) {
                console.log(err);
                throw err;
              }
              console.log('The programImage has been saved!');
            });
            await newProgramImage.save()

            robot = new Robot({name, description, type, hasProgram, createdAt, popularity: 0,
              instructionId: newInstruction._id, robotImageId: newRobotImage._id,
              programId: newProgram._id, programImageId: newProgramImage._id})

              console.log('Добавлена постройка с программой, но без изображения программы: '  + robot._id);
          } else {
            robot = new Robot({name, description, type, hasProgram, createdAt, popularity: 0,
              instructionId: newInstruction._id, robotImageId: newRobotImage._id,
              programId: newProgram._id})

            console.log('Добавлена постройка с программой: '  + robot._id);
            await robot.save()
          }
        } else {
          robot = new Robot({
            name, description, type, hasProgram, createdAt, popularity: 0,
            instructionId: newInstruction._id, robotImageId: newRobotImage._id,
          })

          console.log('Добавлена постройка без программы: '  + robot._id);
          await robot.save()
        }

        res.send({robots: robot})
      }
    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

  app.delete('/api/robots/:id', async (req, res) => {
    try {

      const robot = await Robot.findOne({_id: req.params.id})

      const robotImage = await RobotImage.findOne({ _id:robot.robotImageId })
      await fs.unlink(robotImage.filePath, (err) => {
        if (err) console.log(err);
        console.log(`Изображение робота ${robotImage.filePath} было удалено`);
      });
      await robotImage.remove()

      const instruction = await Instruction.findOne({ _id:robot.instructionId })
      await fs.unlink(instruction.filePath, (err) => {
        if (err) throw err;
        console.log(`Инструкция ${instruction.filePath} была удалена`);
      });
      await instruction.remove()

      if(robot.hasProgram) {
        const program = await Program.findOne({ _id:robot.programId })
        await fs.unlink(program.filePath, (err) => {
            if (err) throw err;
            console.log(`Программа ${program.filePath} была удалена`);
          });
        await program.remove()

        if(robot.programImage) {
          const programImage =  await ProgramImage.findOne({ _id:robot.programImageId })
          await fs.unlink(programImage.filePath, (err) => {
            if (err) throw err;
            console.log(`Изображение программы ${programImage.filePath} было удалено`);
          });
          await programImage.remove()
        }
      }
      await robot.remove()

      res.send({ robots:{ id: robot._id }})

      console.log('Робот удален');
    } catch (e) {
      res.send({ errors: {msg: "Что-то пошло не так, попробуйте снова" } } )
    }
  })

  app.post('/api/likes', async (req, res) => {
    try {
      const { userId = {}, robotId = {} } = req.body.like
      const like = new Like({userId: userId, robotId: robotId})
      like.toObject()
      await like.save()

      res.send({likes: like})

      console.log("Лайк поставлен:", like);
    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

  app.get('/api/likes/:id', async (req, res) => {
    try {


      console.log(req.params.id);
      const like = await Like.findOne({ _id: req.params.id })

      res.send({like: like})

      console.log('Найдена постройка: ' + robot._id);

    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

  app.delete('/api/likes/:id', async (req, res) => {
    try {

      const like = await Like.findOne({_id: req.params.id})
      await like.remove()
      res.send({ likes: like })
        console.log("Лайк убран");
    } catch (e) {
      res.send({errors:{msg: "Что-то пошло не так, попробуйте снова"}})
    }
  })

start()


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
