import Controller from '@ember/controller';
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class LoginController extends Controller {

  @service session
  @service('paperToaster') paperToaster

  @tracked login = ''
  @tracked password = ''

  @tracked errorMessage = null

  @action
  async signUp(login, password) {
    const attrs = { login, password }
    const session = this.get('session');
    try {
      await session.authenticate('authenticator:oauth2', login, password);
    } catch (error) {
      console.log(error);
      this.errorMessage = error.responseJSON.error
    }
    if(this.session.isAuthenticated) this.openToast()
  }

  openToast() {
    this.get('paperToaster').show('Вход на сайт прошел успешно!')
  }
}
