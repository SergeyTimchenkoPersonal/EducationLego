import Route from '@ember/routing/route';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'
import DS from 'ember-data';

export default class EditRobotRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Изменение постройки')
  }

  async model(params) {
    super.model(...arguments)
    console.log(params);
    const robot = await this.store.findRecord('robot', params.item)
    return robot
  }

  setupController(controller, model) {
    controller.set('robot', model)
    controller.set('name', model.name)
    controller.set('description', model.description)
    controller.set('type', model.type)
    controller.set('hasProgram', model.hasProgram)
    controller.set('robotImage', new Blob([model.robotImage], {
      type: "image/jpeg"
    }))
    controller.set('instruction', new Blob([model.instruction],{
       type: `application/pdf`
    }))
    controller.set('program', new Blob([model.program], {
      type: `application/${model.type}`
    }))
    controller.set('programImage', new Blob([model.programImage], {
      type: "image/jpeg"
    }))

  }
}
