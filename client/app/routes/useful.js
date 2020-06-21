import Route from '@ember/routing/route';

export default class TheoryUsefulRoute extends Route {


  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Полезные ссылки')
  }

}
