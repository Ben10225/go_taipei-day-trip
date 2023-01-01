import nav from "../nav/nav_setting.js"

const bookingBox = document.querySelector(".booking_box");
const totalCost = document.querySelector(".total_cost");
const userName = document.querySelector(".user_name");
const userInfoBox = document.querySelector(".user_info_box");
const creditCardBox = document.querySelector(".credit_card_box");
const totalBox = document.querySelector(".total_box");
const footer = document.querySelector("footer");
const userTitle = document.querySelector(".user_title");
const creditInputs = document.querySelectorAll(".credit_input");
const submitBtn = document.querySelector(".submit_btn");
const contactName = document.querySelector(".contact_name");
const contactEmail = document.querySelector(".contact_email");
const contactMobile = document.querySelector(".contact_mobile");
const wait = document.querySelector(".wait");

const mobilePattern = /^((?=(09))[0-9]{10})$/;
const emailPattern = /^\S+@\S+$/;

let totalPrice = 0;
let bidLst = [];

function getBooking(){
  return fetch("/api/booking")
  .then((response) => response.json())
  .then((data) => {
    if(data.data && !data.empty){
      createBookingDOM(data);
      getUserInfo(contactName, contactEmail);
      preventBtn();
      wait.remove();
      return
    }
    if(data.data && data.empty){
      createEmptyBookingDOM(data);
      wait.remove();
      return
    }
  })
}


function createBooking(id, date, time, status){
  let price;
  time === "morning" ? price = 2000 : price = 2500;
  fetch("/api/booking", {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "attractionId": id,
      "date": date,
      "time": time,
      "price": price,
      "status": status
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      window.location.href = "/booking";
    }
    if(data.error){
      if(data.message === "此行程已存在"){
        nav.bookingRepeatIn();

      }else if(data.message === "未登入狀態"){
        window.location.href = "/";
      }
    }
  })
}


function deleteBooking(bid, status){
  fetch("/api/booking", {
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "bid": bid,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if(status === "order"){
      return
    }
    if(data.ok){
      history.go(0);
      return
    }
    if(data.error){
      window.location.href = "/";
    }
  })
}


function getUserInfo(nameDOM, emailDOM){
  return fetch("/api/booking/getinfo")
  .then((response) => response.json())
  .then((data) => {
    if(data.data){
      nameDOM.value = data.data.name;
      emailDOM.value = data.data.email;
    }
    if(data.error){
      window.location.href = "/";
    }
  })
}


function createBookingDOM(data){
  // run for
  data.data.forEach((book, i)=>{

    // preload
    let link = document.createElement('link');
    link.href = book.attraction.image;
    link.rel = "preload";
    link.as = "image";
    document.head.appendChild(link);

    // create DOM
    let bookingItem = document.createElement("div");
    bookingItem.className = "booking_item";
    bookingItem.setAttribute("attraction_id", book.attraction.id)
    bookingBox.appendChild(bookingItem);

    let img = document.createElement("div");
    img.className = "img";
    img.style.cssText = `background-image: url('${book.attraction.image}')`;

    let iconDelete = document.createElement("div");
    iconDelete.className = "icon_delete";
    bidLst.push(book.bid);
    iconDelete.addEventListener("click", ()=>{
      deleteBooking([book.bid]);
    })

    let content =  document.createElement("div");
    content.className = "content";

    let el = document.querySelector(`.booking_item:nth-child(${i+2})`);
    el.appendChild(img);
    el.appendChild(iconDelete);
    el.appendChild(content);

    el = document.querySelector(`.booking_item:nth-child(${i+2}) > .content`);

    let h6 = document.createElement("h6");
    h6.textContent = "台北一日遊： ";
    let attractionName = document.createElement("span");
    attractionName.className = "attraction_name";
    attractionName.textContent = book.attraction.name;
    h6.appendChild(attractionName);

    let date = document.createElement("h5");
    date.textContent = "日期： ";
    date.className = "date";
    let dateSpan = document.createElement("span");
    dateSpan.textContent = book.date;
    date.appendChild(dateSpan);

    let time = document.createElement("h5");
    time.textContent = "時間： ";
    time.className = "time";
    let timeSpan = document.createElement("span");
    if(book.time === "morning"){
      timeSpan.textContent = "早上 7 點到下午 3 點";
    }else{
      timeSpan.textContent = "下午 1 點到晚上 9 點";
    }
    time.appendChild(timeSpan);

    let cost = document.createElement("h5");
    cost.textContent = "費用： ";
    cost.className = "cost";
    let costSpan = document.createElement("span");
    costSpan.textContent = `新台幣 ${book.price} 元`;
    cost.appendChild(costSpan);

    let address = document.createElement("h5");
    address.textContent = "地點： ";
    address.className = "address";
    let addressSpan = document.createElement("span");
    addressSpan.textContent = book.attraction.address;
    address.appendChild(addressSpan);

    el.appendChild(h6);
    el.appendChild(date);
    el.appendChild(time);
    el.appendChild(cost);
    el.appendChild(address);

    totalPrice += book.price;
  })

  // out for
  let hr = document.createElement("hr");
  bookingBox.appendChild(hr);
  userName.textContent = data.name;
  totalCost.textContent = totalPrice;
  userTitle.classList.add("normal_title");
}


function createEmptyBookingDOM(data){
  userName.textContent = data.name;
  let empty = document.createElement("div");
  empty.className = "empty_msg";
  empty.textContent = "目前沒有任何待預訂的行程";
  bookingBox.appendChild(empty);
  footer.classList.add("empty");
  userTitle.classList.add("empty_title");
  userInfoBox.replaceChildren();
  creditCardBox.replaceChildren();
  totalBox.replaceChildren();
}


function jumpToNextInput(){
  creditInputs.forEach(function(el, index){
    el.addEventListener("keyup", function(event){
      if(el.value.length == el.maxLength){
        if(index == 0){
          creditInputs[index+1].focus();
        }else if(index == 1){
          creditInputs[index+1].focus();
        }else if(index == 2){
          creditInputs[index+1].focus();
        }
      }
      if(index == 0){
        el.addEventListener("input", (e)=>{
          e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        });
      }
    })
  })
}

function verifyInfo(){
  contactName.addEventListener("input", (e)=>{
    if(e.target.value){
      submitBtn.style = "pointer-events: auto; opacity: 1";
    }else{
      preventBtn();
    }
  })
  
  contactEmail.addEventListener("input", (e)=>{
    let bool = emailPattern.test(e.target.value);
    if(bool){
      submitBtn.style = "pointer-events: auto; opacity: 1";
      contactEmail.style = "border: 1px solid #E8E8E8";
    }else{
      preventBtn();
      if(contactEmail.value == ""){
        contactEmail.style = "border: 1px solid #E8E8E8";
      }else{
        contactEmail.style = "border: 1px solid red";
      }
    }
  })
  
  contactMobile.addEventListener("input", (e)=>{
    let bool = mobilePattern.test(e.target.value);
    if(bool){
      submitBtn.style = "pointer-events: auto; opacity: 1";
      contactMobile.style = "border: 1px solid #E8E8E8";
    }else{
      preventBtn();
      if(contactMobile.value == ""){
        contactMobile.style = "border: 1px solid #E8E8E8";
      }else{
        contactMobile.style = "border: 1px solid red";
      }
    }
  })
}


function preventBtn(){
  submitBtn.style = "pointer-events: none; opacity: 0.5";
}


export default {
  createBooking,
  getBooking,
  jumpToNextInput,
  verifyInfo,
  deleteBooking,
  bidLst,
  getUserInfo,
}