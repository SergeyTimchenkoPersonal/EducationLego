import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('main');
  this.route('theory');
  this.route('register');
  this.route('login');
  this.route('addRobotItem', { path: '/admin/addRobotItem' });
  this.route('editRobotItem', { path: '/admin/editRobotItem' });
  this.route('robots');
  // function() {
  //   this.route('item', { path: '/:item' });
  // });
  this.route('profile');
});
