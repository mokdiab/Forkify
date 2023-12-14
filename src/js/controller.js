import * as model from './model';
import 'core-js/stable';
import { MODAL_CLOSE_SEC } from './config.js';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // update search results
    resultsView.updateRender(model.setPage());
    bookmarksView.updateRender(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controllSearch = async function () {
  try {
    // get query
    const query = searchView.getQuery();
    if (!query) return;
    // render spinner
    resultsView.renderSpinner();
    // load search results
    await model.loadSearchResults(query);
    //render results
    resultsView.render(model.setPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};
const controlPagination = function (goTopage) {
  resultsView.render(model.setPage(goTopage));
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.setServings(newServings);
  recipeView.updateRender(model.state.recipe);
};
const addRemBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.updateRender(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlUpload = async function (dataArr) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(dataArr);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message, err.status);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(addRemBookmarks);
  searchView.addHandlerSearch(controllSearch);
  paginationView.addButtonHandler(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlUpload);
};
init();
