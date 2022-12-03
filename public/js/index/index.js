import lib from "./index_func.js"


window.keywordSelect = lib.keywordSelect;
window.showCategory = lib.showCategory;

lib.catchCategories();
lib.catchAttractions(lib.page);

lib.observer.observe(lib.target);
