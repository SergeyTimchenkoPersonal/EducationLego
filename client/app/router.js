import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  rootURL = config.rootURL;
  location = config.locationType
}

Router.map(function() {
  this.route('main');
  this.route('mindstorms', {path: '/theory/MindStorms'});
  this.route('useful', {path: '/theory/usefulLinks'});
  this.route('wedo', {path: '/theory/WeDo'});
  this.route('theory');
  this.route('register');
  this.route('login');
  this.route('profile');
  this.route('addRobot', { path: '/admin/addRobot' });
  this.route('robots', function() {
    this.route('item', { path: '/:item' });
    this.route('editRobot', { path: '/:item/edit'});
  });
});
