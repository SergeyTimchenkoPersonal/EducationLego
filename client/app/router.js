import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('main');
  this.route('catalog');
  this.route('theory');
  this.route('register');
  this.route('login');
  this.route('addBuildItem');
});
