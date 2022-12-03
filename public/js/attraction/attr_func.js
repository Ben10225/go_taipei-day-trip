
let imgs = [];
let imgIndex = 0;
let cirpos = 1;
let img = document.querySelector(".img");


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
      document.title = data.name;
      insertContent(data);
      insertImg(data);
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
  let loads = document.querySelector(".loads");
  
  for(let i=0;i<data.images.length;i++){
    imgs.push(data.images[i]);
    let circle = document.createElement('div');
    circle.className = "circle";
    circleBox.appendChild(circle);

    let load = document.createElement('div');
    load.className = "load";
    loads.appendChild(load);

    let loading = document.querySelector(`.load:nth-child(${i+1})`)
    loading.style.cssText = `background-image: url('${imgs[i]}')`

    let cir = document.querySelector(`.circle:nth-child(${i+1})`)
    if(i==0){
      cir.classList.add("circle_black");
    }
    
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
  img.style.cssText = `background-image: url('${imgs[0]}')`;

  setTimeout(()=>{
    loads.remove();
  }, 2000)
}


let leftArrow = document.querySelector(".left_arrow");
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


let rightArrow = document.querySelector(".right_arrow");
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

      rightArrow.addEventListener("click", rck)
    },500)
  }
})


let morningClick = ()=>{
  let cost = document.querySelector(".cost");
  cost.textContent = "2000";
}


let eveningClick = ()=>{
  let cost = document.querySelector(".cost");
  cost.textContent = "2500";
}


export default {
  catchAttraction,
  morningClick,
  eveningClick,
}

