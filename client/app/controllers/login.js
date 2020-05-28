import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class LoginController extends Controller {

  @service session
  @tracked login = 'admin'
  @tracked password = 'admin0'

  @tracked errorMessage = null

  @action
  async signUp(login, password) {
    const attrs = { login, password }
    try {
      console.log('login', login, password);
      const session = this.get('session');
      await session.authenticate('authenticator:oauth2', login, password);
    } catch (e) {
      console.log(e);
    }
    if (this.session.isAuthenticated) {
        console.log('Вы вошли на сайт');
        console.log(this.session.data.authenticated.user);
        // this.transitionToRoute('main')
      }
  }
}
