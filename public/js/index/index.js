import attr from "./index_func.js"
import nav from "../nav/nav_setting.js"


window.keywordSelect = attr.keywordSelect;
window.showCategory = attr.showCategory;
window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;
window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;

nav.hideDisplayBug();
nav.auth(false);

attr.catchCategories();
attr.catchAttractions(attr.page);

attr.observer.observe(attr.target);
