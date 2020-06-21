import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;
  @attr('string') surname;
  @attr('boolean') isAdmin;
  @attr('string') email;
  @attr('string') login;
  @attr('string') password;

  // get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}
