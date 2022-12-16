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

let totalPrice = 0;

function getBooking(){
  return fetch("/api/booking")
  .then((response) => response.json())
  .then((data) => {
    if(data.data && !data.empty){
      createBookingDOM(data);
      return
    }
    if(data.data && data.empty){
      createEmptyBookingDOM(data);
      return
    }
    if(data.error){
      window.location.href = "/";
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


function deleteBooking(bid){
  console.log(bid)
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
    if(data.ok){
      history.go(0);
      return
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
    bookingBox.appendChild(bookingItem);

    let img = document.createElement("div");
    img.className = "img";
    img.style.cssText = `background-image: url('${book.attraction.image}')`;

    let iconDelete = document.createElement("div");
    iconDelete.className = "icon_delete";
    iconDelete.addEventListener("click", ()=>{
      deleteBooking(book.bid)
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
    let dateSpan = document.createElement("span");
    dateSpan.textContent = book.date;
    date.appendChild(dateSpan);

    let time = document.createElement("h5");
    time.textContent = "時間： ";
    let timeSpan = document.createElement("span");
    if(book.time === "morning"){
      timeSpan.textContent = "早上 7 點到下午 3 點";
    }else{
      timeSpan.textContent = "下午 1 點到晚上 9 點";
    }
    time.appendChild(timeSpan);

    let cost = document.createElement("h5");
    cost.textContent = "費用： ";
    let costSpan = document.createElement("span");
    costSpan.textContent = `新台幣 ${book.price} 元`;
    cost.appendChild(costSpan);

    let address = document.createElement("h5");
    address.textContent = "地點： ";
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
  // body.style.backgroundColor = "#757575";
  // section.style.backgroundColor = "#fff";
  userInfoBox.replaceChildren();
  creditCardBox.replaceChildren();
  totalBox.replaceChildren();
}


function jumpToNextInput(){
  creditInputs.forEach((el, index)=>{
    el.addEventListener("keyup", ()=>{
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


export default {
  createBooking,
  getBooking,
  jumpToNextInput,
}