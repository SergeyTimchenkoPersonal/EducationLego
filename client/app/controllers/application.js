import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class ApplicationController extends Controller {

  @tracked session = false;
  @tracked username = 'Sergey'
  @tracked pageTitle = ''

  @action
  logout() {
    this.get('session').invalidate()
  }

}
