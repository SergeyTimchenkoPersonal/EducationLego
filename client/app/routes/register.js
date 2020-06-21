import Route from '@ember/routing/route';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'
import DS from 'ember-data';

export default class RegisterRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Регистрация')
  }

  deactivate() {
    this.controller.set('name', null)
    this.controller.set('surname', null)
    this.controller.set('email', null)
    this.controller.set('login', null)
    this.controller.set('password', null)
    this.controller.set('repeatPas', null)
    this.controller.set('errorMessage', null)
  }
}
