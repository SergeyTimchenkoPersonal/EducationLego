import Route from '@ember/routing/route';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'
import DS from 'ember-data';

export default class ProfileRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Профиль пользователя')
  }

}
