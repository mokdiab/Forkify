import View from './view.js';
import previewView from './previewView.js';
class BookmarksView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.bookmarks');
    this._errorMessage =
      'No bookmarks yet. Find a nice recipe and bookmark it :)';
    this._successMessage = '';
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler());
  }
  _generateMarkup() {
    return `
        ${this._data
          .map(bookmark => previewView.render(bookmark, false))
          .join('')}
    `;
  }
}

export default new BookmarksView();
