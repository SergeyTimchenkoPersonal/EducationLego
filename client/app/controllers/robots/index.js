import Controller from '@ember/controller'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'
import EmberArray from '@ember/array';

export default class RobotsIndexController extends Controller {

  @service session;

  @tracked name = null
  @tracked hasProgram = false
  @tracked type = null

  @tracked sortBy = null

  @tracked rawRobots = []
  @tracked robots = []

  @action
  showItem(itemId) {
    this.transitionToRoute('robots.item', itemId)
  }

  @action
  searchRobots(name) {
    this.name = name.toLowerCase()
    this.filter()
  }

  @action
  toggleHasProgram() {
    this.hasProgram = !this.hasProgram
    this.filter()
  }

  filter() {
    const filter = {
      hasProgram: this.hasProgram,
      type: this.type,
      name: this.name
    }
    this.robots = this.rawRobots.filter((robot) => {
      for (let key in filter) {
        if(key == 'name' && filter.name != null) {
          let name = filter[key]
          const robotName = robot.name
          if(robotName.toLowerCase().includes(name)) {
            return true
          }
        }
        if ((robot[key] != filter[key] && filter[key] != null && filter[key] != false)) return false;
      }
    return true;
    });
    this.robots = this.robots.sortBy(this.sortBy)
    if(this.sortBy != 'createdAt') {
      this.robots = this.robots.reverse()
    }
  }

  @action
  filterByType(filter) {
    if (filter == 'all') {
      this.type = null
    } else {
      this.type = filter
    }
    this.filter()
  }

  @action
  toggleSort(sortBy) {
    this.sortBy = sortBy
    this.robots = this.robots.sortBy(this.sortBy)
    if(this.sortBy != 'createdAt') {
      this.robots = this.robots.reverse()
    }
  }
}
