import Component from '@glimmer/component'
import { action } from '@ember/object'
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'

export default class RobotItemComponent extends Component {
  @service session;
  @service store;


  @alias('args.robot') robot

  @action
  selectRobot(itemId) {
    this.args.selectRobot(itemId)
  }

  @action
  async createLike(itemId) {
    this.robot.isLiked = !this.robot.isLiked
    if(this.robot.isLiked) {
      const like = await this.store.createRecord('like', {
        userId: this.session.data.authenticated.user.id,
        robotId: itemId
      }).save()
      await this.store.findAll('robot')
    } else {
      const like = await this.store.findRecord('like', this.robot.likeId)
      await like.destroyRecord()
      await this.store.findAll('robot')
    }
  }
}
