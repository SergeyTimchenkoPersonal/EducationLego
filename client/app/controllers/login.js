import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class LoginController extends Controller {

  @service session

  @tracked errorMessage = null

  // get routeAfterAuthentication() {
  //   return 'main'
  // }

  @action
  authentificate() {
    // const { login, password} = this.getProperties('login', 'password')
    //
    // this.get('session').authentificate('authenticator:oauth2', login, password).catch((reason) => {
    //   this.set('errorMessage', reason.error)
    // })
  }
}
