import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class RegisterController extends Controller {

  @service session

  @tracked name = 'Сергей'
  @tracked surname = 'Тимченко'
  @tracked email = 'admin@gmail.com'
  @tracked login = 'admin'
  @tracked password = 'admin'
  @tracked repeatPas = 'admin'

  @tracked errorMessage = null


  @action
  register() {
    const {name, surname, email, login, password, repeatPas} = this.getProperties('name', 'surname', 'email', 'login', 'password', 'repeatPas')
    console.log('!!!', name, surname, email, login, password, repeatPas);
    if(repeatPas == password) {
      this.store.createRecord('user', {
        name: name,
        surname:surname,
        email: email,
        login: login,
        password: password
      }).save()
      this.transitionToRoute('login')
    }

  }
}
