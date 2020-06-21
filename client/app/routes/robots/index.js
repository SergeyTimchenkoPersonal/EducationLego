import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default class RobotsIndexRoute extends Route {

  @service session;

  model(params) {
    super.model(...arguments)
    this.store.findAll('robot').then((robots) => {
        this.controller.set('rawRobots', robots)
        this.controller.set('robots', robots)
    })
  }

  deactivate() {
    this.controller.set('hasProgram', false)
    this.controller.set('name', null)
    this.controller.set('type', null)
    this.controller.set('sortBy', null)
  }
}
