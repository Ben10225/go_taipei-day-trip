import nav from "../nav/nav_setting.js"
import thankyou from "./thankyou_func.js"

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;
window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;
window.toBooking = nav.toBooking;

nav.loadWaitingSvg();
nav.hideDisplayBug();
thankyou.setValue();
thankyou.getOrder(thankyou.value);

(async()=>{
  await nav.auth(false, "thankyou");
})()
