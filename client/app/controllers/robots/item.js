import Controller from '@ember/controller'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'

export default class RobotsItemController extends Controller {

  @service('paperToaster') paperToaster

  @service session
  @tracked isShowModal = false
  @tracked robot = null

  @action
  editRobot(itemId) {
    this.transitionToRoute(`robots.editRobot`, itemId)
  }

  deleteRobot(itemId) {
    const robot = this.store.peekRecord('robot', itemId)
    robot.destroyRecord().then(() => {
      this.transitionToRoute('robots')
    })
  }

  @action
  async acceptOperation() {
    if (this.confirmationAction == 'deleteRobot') {
      await this.deleteRobot(this.cancelRobotId)
      this.openToast()
    }
    this.closeModal()
  }

  @action
  closeModal() {
    this.confirmationAction = null
    this.cancelPositionId = null
    this.cancelPositionQty = null
    this.isShowModal = false
  }

  @action
  async cancelRobot(id) {
    this.confirmationAction = 'deleteRobot'
    this.cancelRobotId = id
    this.isShowModal = true
  }

  openToast() {
    this.get('paperToaster').show('Постройка была удалена!')
  }

}
