class SearchView {
  #parentEl = document.querySelector('.search');
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clear();
    return query;
  }
  #clear() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
}
export default new SearchView();
