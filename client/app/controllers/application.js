import Controller from '@ember/controller';
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class ApplicationController extends Controller {

  @service session
  @tracked pageTitle = ''

  @action
  async logout() {
    await this.get('session').invalidate()
    this.transitionToRoute('main')
  }

}
