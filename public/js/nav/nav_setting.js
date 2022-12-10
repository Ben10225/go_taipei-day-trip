// dom
const signInbtn = document.querySelector(".btn.si");
const signUpbtn = document.querySelector(".btn.su");
const signInPageBox = document.querySelector(".page_box.si");
const signUpPageBox = document.querySelector(".page_box.su");
const signInMsg = document.querySelector(".msg.si");
const signUpMsg = document.querySelector(".msg.su");
const signInUpLi = document.querySelector(".sign_in_up");
const signOutLi = document.querySelector(".sign_out");
const signPage = document.querySelector(".sign_page");
const schedule = document.querySelector(".schedule");
const SIcautionBox = document.querySelector(".caution_box.si");
const SUcautionBox = document.querySelector(".caution_box.su");

// input
const SUName = document.querySelector(".name.su");
const SUEmail = document.querySelector(".email.su");
const SUPwd = document.querySelector(".pwd.su");
const SIEmail = document.querySelector(".email.si");
const SIPwd = document.querySelector(".pwd.si");

// regex
const EmailPattern = /^\S+@\S+$/;
const PwdPattern = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{2,}$/;

let signInkeyWait = true;
let signUpkeyWait = true;

/*  show signIn page  */
function showSignIn(){
  if(!signPage.classList.contains("sign_page_show")){
    signPage.classList.add("sign_page_show");
  }
  setTimeout(()=>{
    signInPageBox.classList.add("page_box_show");
  }, 150)
}

const inIcon = document.querySelector(".exit_icon.si");
inIcon.addEventListener("click", ()=>{
  fadeOut(".page_box.si", true);
})


function toggleSignIn(){
  showSignIn();
  fadeOut(".page_box.su", false);
}


/*  show signUp page  */
function showSignUp(){
  signPage.classList.add("sign_page_show");
  fadeOut(".page_box.si", false);
  setTimeout(()=>{
    signUpPageBox.classList.add("page_box_show");
  }, 150)
}

const upIcon = document.querySelector(".exit_icon.su");
upIcon.addEventListener("click", function upExit(){
  fadeOut(".page_box.su", true);
})


/*  press X to exit  */
function fadeOut(boxClass, pressX){
  let pageBox = document.querySelector(boxClass);
  if(pressX){
    signPage.classList.remove("sign_page_show");
    setTimeout(()=>{
      SUName.value = "";
      SUEmail.value = "";
      SUPwd.value = "";
      SIEmail.value = "";
      SIPwd.value = "";
    }, 1000)
  }

  setTimeout(()=>{
    pageBox.classList.remove("page_box_show");
  }, 150)
}


/*  press enter to submit  */
document.addEventListener("keydown", (e)=>{
  let singInOpacity = Math.round(getComputedStyle(signInPageBox).opacity);
  let singUpOpacity = Math.round(getComputedStyle(signUpPageBox).opacity);

  if(signInkeyWait && singInOpacity){
    pressEnter(e, signIn, "signIn");
  }
  if(signUpkeyWait && singUpOpacity){
    pressEnter(e, signUp, "signUp");
  }
})

function pressEnter(e, callback, status){
  if(e.key == "Enter" && status == "signIn"){
    callback();
    signInkeyWait = false;
    setTimeout(()=>{
      signInkeyWait = true;
    }, 2000)
  }
  if(e.key == "Enter" && status == "signUp"){
    callback();
    signUpkeyWait = false;
    setTimeout(()=>{
      signUpkeyWait = true;
    }, 2000)
  }
}


/*  sign in  */
function signIn(){
  let validatedEmail = EmailPattern.test(SIEmail.value);
  let validatedPwd = PwdPattern.test(SIPwd.value);

  signInbtn.style.pointerEvents = "none";

  if(!validatedEmail){
    signInMsg.textContent = "信箱格式錯誤";
    showMsg(signInMsg, signInbtn, false, "signIn");
    return;
  }
  if(!validatedPwd){
    signInMsg.textContent = "密碼格式錯誤";
    showMsg(signInMsg, signInbtn, false, "signIn");
    return;
  }

  fetch("/api/user/auth", {
    method: "put",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "email": SIEmail.value,
      "password": SIPwd.value,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.error){
      signInMsg.textContent = data.message;
      showMsg(signInMsg, signInbtn, false, "signIn");
      return;
    }
    if(data.data){
      signInMsg.textContent = "登入成功";
      showMsg(signInMsg, signInbtn, true, "signIn");
      SIEmail.value = "";
      SIPwd.value = "";
      auth(true);
    }
  })
}


/*  sign up  */
function signUp(){
  let validatedEmail = EmailPattern.test(SUEmail.value);
  let validatedPwd = PwdPattern.test(SUPwd.value);

  signUpbtn.style.pointerEvents = "none";

  if(!SUName.value){
    signUpMsg.textContent = "請輸入姓名";
    showMsg(signUpMsg, signUpbtn, false, "signUp");
    return;
  }
  if(!validatedEmail){
    signUpMsg.textContent = "信箱格式錯誤";
    showMsg(signUpMsg, signUpbtn, false, "signUp");
    return;
  }
  if(!validatedPwd){
    signUpMsg.textContent = "密碼格式錯誤";
    showMsg(signUpMsg, signUpbtn, false, "signUp");
    return;
  }

  fetch("/api/user", {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "name": SUName.value,
      "email": SUEmail.value,
      "password": SUPwd.value,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.error){
      signUpMsg.textContent = data.message;
      showMsg(signUpMsg, signUpbtn, false, "signUp");
      return;
    }
    if(data.data){
      signUpMsg.textContent = "註冊成功";
      showMsg(signUpMsg, signUpbtn, true, "signUp");
      SUName.value = "";
      SUEmail.value = "";
      SUPwd.value = "";
    }
  })
}


function auth(needRefresh){
  fetch("/api/user/auth")
  .then((response) => response.json())
  .then((data) => {
    schedule.classList.remove("li_out");
    if(data.ok){
      signOutLi.classList.remove("li_out");
    }
    if(data.error){
      signInUpLi.classList.remove("li_out");
    }
    if(needRefresh){
      history.go(0);
    }
  })
}


function signOut(){
  fetch("/api/user/auth", {
    method: "delete",
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      history.go(0);
    }
  })
}


function showMsg(el, btn ,dataCheckedBool, status){
  if(dataCheckedBool){
    el.style.color = "rgb(20, 138, 73)";
  }else{
    el.style.color = "rgb(208, 35, 35)";
  }
  setTimeout(()=>{
    if(status === "signIn"){
      SIcautionBox.style.height = "35px";
    }else{
      SUcautionBox.style.height = "35px";
    }
    el.style.opacity = "1";
  }, 1)
  setTimeout(()=>{
    if(status === "signIn"){
      SIcautionBox.style.height = "10px";
    }else{
      SUcautionBox.style.height = "10px";
    }
    el.style.opacity = "0";
    btn.style.pointerEvents = "auto";
  }, 2000)
}


function hideDisplayBug(){
  setTimeout(()=>{
    signPage.style.display = "block";
  },600)
}



export default {
  signIn,
  signUp,
  signOut,
  auth,
  showSignIn,
  showSignUp,
  toggleSignIn,
  hideDisplayBug,
}