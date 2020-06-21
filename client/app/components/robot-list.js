import Component from '@ember/component'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class RobotListComponent extends Component {

  @service session;

  @tracked robots = []
  @tracked filteredRobots = []

  @action
  selectRobot(itemId) {
    this.showRobot(itemId)
  }
}
