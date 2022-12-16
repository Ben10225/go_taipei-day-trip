import nav from "../nav/nav_setting.js"
import booking from "./booking_func.js"

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;
window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;
window.toBooking = nav.toBooking;

nav.hideDisplayBug();
booking.jumpToNextInput();

(async()=>{
  await nav.auth(false, "booking");
})()
