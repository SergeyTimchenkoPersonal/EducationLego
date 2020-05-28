import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service'
import config from '../config/environment';
import { computed } from '@ember/object';

export default class ApplicationAdapter extends RESTAdapter.extend(DataAdapterMixin)  {

  @service session

  @computed('session.data.authenticated.access_token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // OAuth 2
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }

  namespace = config.namespace
  host = config.url
  // authorizer = 'authorizer:application'
}
