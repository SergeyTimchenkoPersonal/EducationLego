import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class ApplicationController extends Controller {

  @service session
  @tracked pageTitle = ''

  @action
  logout() {
    this.get('session').invalidate()
  }



}
