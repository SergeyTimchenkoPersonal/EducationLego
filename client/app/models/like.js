import Model, { attr } from '@ember-data/model';

export default class LikeModel extends Model {

  @attr('string') userId;
  @attr('string') robotId;
}
