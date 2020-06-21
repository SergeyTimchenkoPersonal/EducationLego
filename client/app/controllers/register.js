import Controller from '@ember/controller';
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class RegisterController extends Controller {

  @service session
  @service('paperToaster') paperToaster
  @tracked name = null
  @tracked surname = null
  @tracked email = null
  @tracked login = null
  @tracked password = null
  @tracked repeatPas = null

  @tracked errorMessage = null

  @action
  async register() {
    const {name, surname, email, login, password, repeatPas} = this.getProperties('name', 'surname', 'email', 'login', 'password', 'repeatPas')
    if(repeatPas == password) {
    const user = await this.store.createRecord('user', {
        name: name,
        surname:surname,
        email: email,
        login: login,
        password: password
      })
      try {
        await user.save()
        this.transitionToRoute('login')
        this.openToast()
      } catch (error) {
        this.errorMessage = 'Такой пользователь уже существует'
      }
    } else {
      this.errorMessage = 'Пароли не совпадают'
    }
  }

  openToast() {
    this.get('paperToaster').show('Регистрация прошла успешно!')
  }
}
