import Model, { attr } from '@ember-data/model';

export default class RobotModel extends Model {

  @attr('string') name;
  @attr('string') description;
  @attr('string') type;
  @attr('string') createdAt;
  @attr('boolean') hasProgram;
  @attr('string') instruction;
  @attr('string') robotImage;
  @attr('string') programImage;
  @attr('string') program;
  @attr('number') popularity;
  @attr('boolean') isLiked;
  @attr('string') likeId;


}
