import Route from '@ember/routing/route';

export default class WedoRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments)
    this.controllerFor('application').set('pageTitle', 'Теория Lego WeDo')
  }

}
