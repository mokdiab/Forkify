import icons from 'url:../../img/icons.svg';
import View from './view.js';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  curPage;
  addButtonHandler(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTopage = +btn.dataset.goto;
      handler(goTopage);
    });
  }
  _generateMarkup() {
    this.curPage = this._data.page;
    const numberOfPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (this.curPage === 1 && numberOfPage > 1) {
      return this._generateButtonMarkup(1);
    }
    if (this.curPage === numberOfPage && numberOfPage > 1) {
      return this._generateButtonMarkup(-1);
    }
    if (this.curPage < numberOfPage) {
      return `${this._generateButtonMarkup(-1)}
      ${this._generateButtonMarkup(1)}`;
    }

    return ``;
  }
  _generateButtonMarkup(role) {
    return `<button data-goto="${this.curPage + role}" class="btn--inline ${
      role === -1 ? 'pagination__btn--prev' : 'pagination__btn--next'
    }">
    ${
      role === -1
        ? `<svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <span>Page ${this.curPage + role}</span>`
        : `<span>Page ${this.curPage + role}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>`
    }
</button>`;
  }
}
export default new PaginationView();
