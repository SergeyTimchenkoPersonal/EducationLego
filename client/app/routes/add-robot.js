import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default class AddRobotRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Добавление постройки')
  }

  deactivate() {
    this.controller.set('name', null)
    this.controller.set('description', null)
    this.controller.set('type', null)
    this.controller.set('hasProgram', false)
    this.controller.set('binaryRobotImage', null)
    this.controller.set('binaryInstruction', null)
    this.controller.set('binaryProgramImage', null)
    this.controller.set('binaryProgram', null)
    this.controller.set('errorMessage', null)
  }

}
