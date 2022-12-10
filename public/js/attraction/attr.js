import attr from "./attr_func.js"
import nav from "../nav/nav_setting.js"


window.morningClick = attr.morningClick;
window.eveningClick = attr.eveningClick;

const id = window.location.href.split("/").pop();

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;

window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;

nav.hideDisplayBug();
nav.auth(false);

attr.catchAttraction(id);


