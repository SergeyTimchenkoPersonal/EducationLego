import Controller from '@ember/controller';
import { computed, action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class RegisterController extends Controller {

  @tracked isAdminCheckbox = false;
  @tracked adminPassword = "0000";
  // @tracked name = null
  // @tracked surname = null
  // @tracked email = null
  // @tracked login = null
  // @tracked password = null
  // @tracked birthdayDate = null
  // @tracked adminPassword = null
  // @action
  // checkForm() {
  //   const {name, surname, email, login, password, birthdayDate, adminPassword, repeatPas} = this.getProperties('name', 'surname', 'email', 'login', 'password', 'birthdayDate', 'adminPassword', 'repeatPas')
  //   console.log('!!!', name, surname, email, login, password, birthdayDate, adminPassword, repeatPas);
  // }

  @action
  register() {

  }
}
