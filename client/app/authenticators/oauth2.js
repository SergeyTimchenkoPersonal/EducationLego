import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

const host = config.url || '';
const namespace = config.namespace;
const serverTokenEndpoint = [ host, namespace, 'login' ];

export default class OAuth2Authenticator extends OAuth2PasswordGrantAuthenticator {

  serverTokenEndpoint = serverTokenEndpoint.join('/')

}
