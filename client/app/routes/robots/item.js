import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default class RobotsItemRoute extends Route {

  async model(params) {
    super.model(...arguments)
    const robot = await this.store.findRecord('robot', params.item)
    return robot
  }

  setupController(controller, model) {
    controller.set('robot', model)
  }

  deactivate() {
    this.controller.set('robot', null)
    this.controller.set('isShowModal', false)
  }

}
