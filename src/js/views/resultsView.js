import previewView from './previewView.js';
import View from './view.js';
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage =
    "We couldn't find any recipe for your search, please try again";
  _generateMarkup() {
    return `
          ${this._data
            .map(result => previewView.render(result, false))
            .join('')}
      `;
  }
}
export default new ResultsView();
