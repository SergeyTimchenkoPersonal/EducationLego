import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'
import DS from 'ember-data';

export default class EditRobotController extends Controller {

  allowedImages = ['jpg', 'png', 'jpeg']
  allowedInstruction = 'pdf'
  allowedPrograms = ['WeDo', 'ev3']

  @tracked errorMessage = null

  @tracked name = null
  @tracked description = null
  @tracked type = null
  @tracked hasProgram = false
  @tracked robotImage = undefined
  @tracked instruction = undefined
  @tracked programImage = undefined
  @tracked program = undefined

  binaryRobotImage = null
  binaryInstruction = null
  binaryProgramImage = null
  binaryProgram = null

  @action
  uploadRobotImage(event) {
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop()
    if(this.allowedImages.includes(fileExt)) {
      const reader = new FileReader()
      reader.onload = () => {
        this.set('binaryRobotImage', reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      document.getElementById('robotImage').value = "";
      this.set('errorMessage', 'Неправильно выбран файл изображения постройки, попробуйте еще раз')
    }
  }

  @action
  uploadInstruction(event){
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop()
    if (this.allowedInstruction.includes(fileExt)) {
      const reader = new FileReader()
      reader.onload = () => {
        this.set('binaryInstruction', reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      document.getElementById('instruction').value = "";
      this.set('errorMessage', 'Неправильно выбран файл инструкции, попробуйте еще раз')
    }
  }
  @action
  uploadProgram(event){
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop()
    if (this.allowedPrograms.includes(fileExt)) {
      const reader = new FileReader()
      reader.onload = () => {
        this.set('binaryProgram', reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      document.getElementById('program').value = "";
      this.set('errorMessage', 'Неправильно выбран файл программы, попробуйте еще раз')
    }
  }
  @action
  uploadProgramImage(event){
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop()
    if (this.allowedImages.includes(fileExt)) {
      const reader = new FileReader()
      reader.onload = () => {
        this.set('binaryProgramImage', reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      document.getElementById('programImage').value = "";
      this.set('errorMessage', 'Неправильно выбран файл изображения программы, попробуйте еще раз')
    }
  }

  @action
  async createRobot() {
    this.set('errorMessage', null)
    const {name, description, type, hasProgram} = this.getProperties('name', 'description', 'type', 'hasProgram')
    console.log(hasProgram);
    this.store.createRecord('robot', {
      name: name,
      description:description,
      type: type,
      hasProgram: hasProgram,
      robotImage: this.binaryRobotImage,
      instruction: this.binaryInstruction,
      program: this.binaryProgram,
      programImage: this.binaryProgramImage,
    }).save()
    this.name = null
    this.description = null
    this.type = null
    this.hasProgram = false
    this.binaryRobotImage = null
    this.binaryInstruction = null
    this.binaryProgramImage = null
    this.binaryProgram = null
    this.transitionToRoute('robots')
  }

}
