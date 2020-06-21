import Route from '@ember/routing/route';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'

export default class LoginRoute extends Route {

  @service session
  get routeAfterAuthentication() {
    return 'main'
  }

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Авторизация')
  }

  deactivate() {
    this.controller.set('login', null)
    this.controller.set('password', null)
    this.controller.set('errorMessage', null)
  }
}
