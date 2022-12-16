import nav from "../nav/nav_setting.js"
import booking from "../booking/booking_func.js"

let imgs = [];
let imgIndex = 0;
let cirpos = 1;
let attractionId = null;
const img = document.querySelector(".img");
const date = document.querySelector(".date");
const evening = document.querySelector("#evening");
const reserveBtn = document.querySelector(".reserve_box button");
const rightArrow = document.querySelector(".right_arrow");
const leftArrow = document.querySelector(".left_arrow");



let catchAttraction = (id)=>{
  let url = `/api/attraction/${id}`
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if(data.error){
      return;
    }
    if(data.data){
      data = data.data;
      document.title = data.name
      insertContent(data);
      insertImg(data);
      attractionId = id;
    }
  })
}


let insertContent = (data)=>{
  let attractionName = document.querySelector(".attraction_name");
  let category = document.querySelector(".category");
  let mrt = document.querySelector(".mrt");
  let description = document.querySelector(".description")
  let address = document.querySelector(".address .details")
  let transport = document.querySelector(".transport .details")

  attractionName.textContent = data.name;
  category.textContent = data.category;
  mrt.textContent = data.mrt;
  description.textContent = data.description;
  address.textContent = data.address.slice(0,3) + " " + data.address.slice(3);
  transport.textContent = data.transport;
}


let insertImg = (data)=>{
  let circleBox = document.querySelector(".circle_box");
  
  for(let i=0;i<data.images.length;i++){
    imgs.push(data.images[i]);
    let circle = document.createElement('div');
    circle.className = "circle";
    circleBox.appendChild(circle);

    let link = document.createElement('link');
    link.href = data.images[i];
    link.rel = "preload";
    link.as = "image";
    document.head.appendChild(link);

    let cir = document.querySelector(`.circle:nth-child(${i+1})`)
    if(i==0){
      cir.classList.add("circle_black");
    }
    // cir.addEventListener("click", circleClick.bind(null, i))

    
    cir.addEventListener("click", function cck(e){
      let circleBefore = document.querySelector(`.circle:nth-child(${cirpos})`);
      let circleAfter = document.querySelector(`.circle:nth-child(${i+1})`);
      cirpos = i+1;
      circleBefore.classList.remove("circle_black");
      circleAfter.classList.add("circle_black");
      imgIndex = i

      img.style.cssText = `background-image: url('${imgs[i]}'); transition: 0.5s`;
      let cirs = document.querySelectorAll(".circle");

      for(let j=0;j<cirs.length;j++){
        cirs[j].style.pointerEvents = "none";
        setTimeout(()=>{
          cirs[j].style.pointerEvents = "auto";
        },500)
      }
    })
    
  }
  img.style.cssText = `background-image: url('${imgs[0]}')`
}

let leftArrowClick = ()=>{
  leftArrow.addEventListener("click", function lck(){
    let circleBefore = document.querySelector(`.circle:nth-child(${imgIndex+1})`);
    let circleAfter = document.querySelector(`.circle:nth-child(${imgIndex})`);
    if(imgIndex > 0){
      leftArrow.removeEventListener("click", lck)
      imgIndex--;
      circleBefore.classList.remove("circle_black");
      circleAfter.classList.add("circle_black");
      cirpos = imgIndex+1;
  
      // slide
      let imgBox = document.querySelector(".img_setup");
      let imgNew = document.createElement('div');
      imgNew.className = "img img_last";
      imgBox.appendChild(imgNew);
  
      let imgOld = document.querySelector(".img");
      let width = imgOld.offsetWidth;
      imgOld.style.cssText = `transform: translateX(${width}px); background-image: url('${imgs[imgIndex+1]}'); transition: transform 0.5s`;
    
      let imgNewSelect = document.querySelector(".img.img_last");
      imgNewSelect.style.cssText = `transform: translateX(${width}px); background-image: url('${imgs[imgIndex]}'); transition: transform 0.5s`;
  
      setTimeout(()=>{
        imgOld.style.cssText = `transform: translateX(0px); background-image: url('${imgs[imgIndex]}'); transition: 0s`;
        imgNewSelect.remove();
  
        leftArrow.addEventListener("click", lck)
      },500)
    }
  })
}


let rightArrowClick = ()=>{
  rightArrow.addEventListener("click", function rck(){
    let circleBefore = document.querySelector(`.circle:nth-child(${imgIndex+1})`);
    let circleAfter = document.querySelector(`.circle:nth-child(${imgIndex+2})`);
    if(imgIndex < imgs.length-1){
      rightArrow.removeEventListener("click", rck)
      imgIndex++;
      circleBefore.classList.remove("circle_black");
      circleAfter.classList.add("circle_black");
      cirpos = imgIndex+1
  
      // slide
      let imgBox = document.querySelector(".img_setup");
      let imgNew = document.createElement('div');
      imgNew.className = "img img_next";
      imgBox.appendChild(imgNew);
    
      let imgOld = document.querySelector(".img");
      let width = imgOld.offsetWidth
      imgOld.style.cssText = `transform: translateX(${-width}px); background-image: url('${imgs[imgIndex-1]}'); transition: transform 0.5s`;
    
      let imgNewSelect = document.querySelector(".img.img_next");
      imgNewSelect.style.cssText = `transform: translateX(${-width}px); background-image: url('${imgs[imgIndex]}'); transition: transform 0.5s`;
    
      setTimeout(()=>{
        imgOld.style.cssText = `transform: translateX(0px); background-image: url('${imgs[imgIndex]}'); transition: 0s`;
        imgNewSelect.remove();
  
        rightArrow.addEventListener("click", rck);
      },500)
    }
  })
}



let morningClick = ()=>{
  let cost = document.querySelector(".cost");
  cost.textContent = "2000";
}


let eveningClick = ()=>{
  let cost = document.querySelector(".cost");
  cost.textContent = "2500";
}


let setDateMixAndMax = ()=>{
  let today = new Date();
  let dd = today.getDate()+1;
  let mm = today.getMonth()+1; // January is 0
  let yyyy = today.getFullYear();

  today = countMonthExtra(mm, dd, yyyy);

  date.setAttribute("min", today);
  dd = parseInt(today.split("-")[2]);
  mm = parseInt(today.split("-")[1]);
  yyyy = parseInt(today.split("-")[0]);
  dd += 31;

  let lastDay = countMonthExtra(mm, dd, yyyy);

  date.setAttribute("max", lastDay);
}

let countMonthExtra = (mm, dd, yyyy)=>{
  if([1, 3, 5, 7, 8, 1, 12].includes(mm)){
    if(dd - 31 > 0){
      dd = dd - 31;
      mm += 1;
    }
  }else if([4, 6, 9, 11].includes(mm)){
    dd = dd - 30
    mm += 1
  }else{
    // 判斷閏年
    if(yyyy%4 != 0){
      dd = dd - 28;
      mm += 1;
    }else{
      dd = dd - 29;
      mm += 1;
    }
  }
  if(mm > 12){
    mm = 1;
    yyyy += 1;
  }
  dd < 10 ? dd = '0'+dd : {};
  mm < 10 ? mm = '0'+mm : {};

  return yyyy+'-'+mm+'-'+dd;
}


let clickBtnOpen = ()=>{
  if(date.value){
    reserveBtn.classList.add("click_open");
  }else{
    reserveBtn.classList.remove("click_open");
  }
}


let signStatus = (isSign)=>{
  if(isSign){
    reserveBtn.onclick = ()=>{
      let checkedRadio = document.querySelector("input[name='time']:checked");
      booking.createBooking(attractionId, date.value, checkedRadio.value, null)
    }
  }else{
    reserveBtn.onclick = ()=>{
      nav.showSignIn("fromAttrBtn");
    }
  }
}

let pushRepeatBooking = ()=>{
  let checkedRadio = document.querySelector("input[name='time']:checked");
  booking.createBooking(attractionId, date.value, checkedRadio.value, "push")
}


let getReserveData = ()=>{
  return fetch("/api/user/auth/cookie")
  .then((response) => response.json())
  .then((data) => {
    if(data.ok){
      date.value = data.date;
      if(data.radio !== "morning"){
        evening.setAttribute('checked', true)
      }
      reserveBtn.classList.add("click_open");
    }
  })
}


export default {
  catchAttraction,
  morningClick,
  eveningClick,
  setDateMixAndMax,
  clickBtnOpen,
  signStatus,
  getReserveData,
  pushRepeatBooking,
  leftArrowClick,
  rightArrowClick,
  reserveBtn,
}

