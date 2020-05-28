import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin'
import Route from '@ember/routing/route';
import { action } from '@ember/object'
import { inject as service } from '@ember/service'

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {

  @service currentUser;

  // beforeModel() {
  //   return this._loadCurrentUser();
  // }
  //
  // async sessionAuthenticated() {
  //   let _super = this._super;
  //   await this._loadCurrentUser();
  //   _super.call(this, ...arguments);
  // }
  //
  // async _loadCurrentUser() {
  //   try {
  //     await this.currentUser.load();
  //   } catch(err) {
  //     await this.session.invalidate();
  //   }
  // }

}
