import attr from "./attr_func.js"
import nav from "../nav/nav_setting.js"

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;

window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;
window.toBooking = nav.toBooking;
window.bookingRepeatOut = nav.bookingRepeatOut;


window.morningClick = attr.morningClick;
window.eveningClick = attr.eveningClick;
window.clickBtnOpen = attr.clickBtnOpen;
window.pushRepeatBooking = attr.pushRepeatBooking;

nav.loadWaitingSvg();
nav.hideDisplayBug();

(async()=>{
  await nav.auth(false, "attraction");
  let bool = nav.signStatus();
  attr.signStatus(bool);
})()


const id = window.location.href.split("/").pop();

attr.setDateMixAndMax();
attr.catchAttraction(id);
attr.leftArrowClick();
attr.rightArrowClick();



