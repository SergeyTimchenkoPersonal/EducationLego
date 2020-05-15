import { inject as service } from '@ember/service'
import JSONAPIAdapter from 'ember-data/adapters/json-api'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin'

export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {

  @service session
  namespace = 'api';

  authorize(xhr) {
    const { idToken } = this.session.data.authenticated
    const authData = `Bearer ${idToken}`
    xhr.setRequestHeader('Authorization', authData)
  }
}
