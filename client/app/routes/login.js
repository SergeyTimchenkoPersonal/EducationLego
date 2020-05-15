import Route from '@ember/routing/route';
// import ApplicationRouteMixin from 'ember-simple-auth-auth0/mixins/application-route-mixin'
import { inject as service } from '@ember/service'

export default class LoginRoute extends Route {

  @service session
  get routeAfterAuthentication() {
    return 'main'
  }

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Аутентификация')
  }

  // afterModel() {
  //   if (!this.session.isAuthenticated) {
  //     const authOptions = {
  //       audience: 'api',
  //       responseType: 'token',
  //       scope: 'openid email profile'
  //     }
  //     this.session.authenticate('authenticator:auth0-universal', authOptions, (err, email) => {
  //       console.log(`Email link sent to ${email}!`)
  //     })
  //   } else {
  //     this.transitionTo('main')
  //   }
  // }
}
