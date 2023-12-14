import View from './view.js';
class AddRecipeView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.upload');
    this._windowEl = document.querySelector('.add-recipe-window');
    this._overlayEl = document.querySelector('.overlay');
    this._btnOpen = document.querySelector('.nav__btn--add-recipe');
    this._btnClose = document.querySelector('.btn--close-modal');
    this._addHanlerToggleWindow();
    this._errorMessage =
      'Wrong entry format, please type the correct format and try again :)';
    this._successMessage = 'Recipe has been added successfully';
  }
  toggleWindow() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }
  _addHanlerToggleWindow() {
    [this._btnClose, this._overlayEl, this._btnOpen].forEach(el =>
      el.addEventListener('click', () => {
        this.toggleWindow();
      })
    );
  }
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
