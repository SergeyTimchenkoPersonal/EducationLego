import Component from '@ember/component'
import { tracked } from '@glimmer/tracking'
import { inject as service } from '@ember/service'
import DS from 'ember-data';

export default class PdfWidgetComponent extends Component {
  @service session;

  @tracked tagName = 'iframe'
  @tracked  attributeBindings = ['src', 'width', 'height', 'frameborder']
  @tracked  src = 'pdffile.pdf'
  @tracked  width = 800
  @tracked  height = 600
  @tracked frameborder =  0

  didInsertElement() {
    new PDFObject({
      url: this.get('src'),
      width: this.get('width'),
      height: this.get('height')}
    ).embed(this.get('elementId'));
  }

// Button Events
// document.querySelector('#prev-page').addEventListener('click', showPrevPage);
// document.querySelector('#next-page').addEventListener('click', showNextPage);

}
