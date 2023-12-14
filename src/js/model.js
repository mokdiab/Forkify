import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipe = function (data) {
  let { recipe } = data;
  return {
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    source: recipe.source_url,
    title: recipe.title,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const { data } = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipe(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};
// function to load search query from API
export const loadSearchResults = async function (query) {
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    let { recipes } = data;
    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};
// function to make page pagination
export const setPage = function (pageNumber = 1) {
  state.search.page = pageNumber;
  const start = (pageNumber - 1) * state.search.resultsPerPage;
  const end = pageNumber * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
// change the servings quantity
export const setServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};
const saveBookmarksToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const loadBookmarksFromLocalStorage = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};
// bookmark the current recipe
export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    state.bookmarks.push(recipe);
    state.recipe.bookmarked = true;
    saveBookmarksToLocalStorage();
  }
};
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
    saveBookmarksToLocalStorage();
  }
};
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(arr => arr[0].startsWith('ingredient') && arr[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replace(/\s/g, '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong entry format, please type the correct format and try again :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
    };
    const { data } = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
loadBookmarksFromLocalStorage();
