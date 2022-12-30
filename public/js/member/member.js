import nav from "../nav/nav_setting.js"
import member from "./member_func.js"
import book from "../booking/booking_func.js"

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;
window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;
window.toBooking = nav.toBooking;
window.changeUserName = member.changeUserName;

nav.loadWaitingSvg();
nav.hideDisplayBug();

(async()=>{
  await nav.auth(false, "member");
  await book.getUserInfo(member.nameInput, member.emailInput);
  member.getHistoryOrders();
  member.inputStyleInit();
  member.getUserImage();
  member.uploadInit();
})()