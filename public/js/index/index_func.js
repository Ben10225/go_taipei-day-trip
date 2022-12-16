
let ct = 0;
let page = 0;
let sum = 0;
let keywordValue = "";
let isload = false;
let showCt = 0;

/*  infiniteScroll  */
const target = document.querySelector('.target');

let options = {
  root: null,
  rootMargin: "50px 50px 50px 50px",
  threshold: 1,
}

let callback = (entries, observer) => {
  ct ++;
  if(ct > 2 && ct % 2 == 1 && !isload){
    catchAttractions(page, keywordValue);
  }
}

let observer = new IntersectionObserver(callback, options);
// observer.observe(target);


/*  fetch category  */
function catchCategories(){
  fetch("/api/categories", {
    method: 'GET',
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.data){
      let category_ul = document.querySelector(".category_ul");
      for(let i=0;i<data.data.length;i++){
        let li = document.createElement('li');
        let liNode = document.createTextNode(`${data.data[i]}`);
        li.appendChild(liNode);
        category_ul.appendChild(li);
        
        // add category btn listener
        li.addEventListener("click", ()=>{
          document.querySelector(".keyword").value = data.data[i];
        })
      }
    }
  })
}


/*  keyword select  */
function keywordSelect(){
  page = 0;
  sum = 0;
  let keyword = document.querySelector(".keyword");
  let attractionsGroup = document.querySelector(".attractions_group");
  attractionsGroup.replaceChildren();
  keywordValue = keyword.value;
  catchAttractions(page, keywordValue);
}


/*  show category block  */
function showCategory(){
  let category_box = document.querySelector(".category_box");
  category_box.style.display = "block";
  setTimeout(() => {
    category_box.style.visibility = "visible";
    category_box.style.opacity = "1";
    category_box.style.transform = "translateY(3px)";
  }, 1)
  let wrapper = document.querySelector(".wrapper");
  let category_ul = document.querySelector(".category_ul");

  setTimeout(() => {
    wrapper.addEventListener("click", function out(e){
      if (!category_ul.contains(e.target)) {
        categoryOut(category_box, wrapper, out);
        return;
      }
      let category_lis = document.querySelectorAll(".category_ul li");
      for(let i of category_lis){
        if(i.contains(e.target)){
          categoryOut(category_box, wrapper, out);
        }
      }
    })
  }, 300)
}


/*  category block fadeout  */
function categoryOut(dom, outter, lintener){
  dom.style.visibility = "hidden";
  dom.style.opacity = "0";
  dom.style.transform = "translateY(-3px)";
  outter.removeEventListener("click", lintener);
}


/*  attractions api  */
function catchAttractions(pg, keyword){
  isload = true;
  let url
  if(keyword){
    url = `/api/attractions?page=${pg}&keyword=${keyword}`
  }else{
    url = `/api/attractions?page=${pg}`
  }
  fetch(url, {
    method: 'GET',
  })
  .then((response) => response.json())
  .then((data) => {
    if(data.error){
      createError(data.message);
      isload = true;
      return;
    }
    if(data.nextPage){
      for(let i=0;i<data.data.length;i++){
        createDOM(data, i, page * data.data.length + i);
      }
      page = data.nextPage;
      sum += data.data.length;
      isload = false
    }else{
      for(let i=0;i<data.data.length;i++){
        createDOM(data, i, sum + i);
      }
      isload = true;
    }
  })
}


/*  create DOM with appendChild  */
function createDOM(data, i, index){
  
  // preload
  let link = document.createElement('link');
  link.href = data.data[i].images[0];
  link.rel = "preload";
  link.as = "image";
  document.head.appendChild(link);

  // 容器
  let attractionsGroup = document.querySelector(".attractions_group");
  // div attraction 
  let attraction = document.createElement('a');
  attraction.setAttribute('href', `/attraction/${data.data[i].id}`);
  attraction.className= "attraction";
  attractionsGroup.appendChild(attraction);
  // div attraction_img 
  let attractionInside = document.querySelector(`.attraction:nth-child(${index+1})`);
  let attractionImg = document.createElement('div');
  attractionImg.className = "attraction_img";
  attractionImg.style.cssText = `background-image: url('${data.data[i].images[0]}')`;
  attractionInside.appendChild(attractionImg);
  // div attraction_name_group
  let attractionImgInside = document.querySelector(`.attraction:nth-child(${index+1}) .attraction_img`);
  let attractionNameGroup = document.createElement('div');
  attractionNameGroup.className = "attraction_name_group";
  attractionImgInside.appendChild(attractionNameGroup);
  // h6 attraction_name 
  let attractionNameGroupInside = document.querySelector(`.attraction:nth-child(${index+1}) .attraction_name_group`);
  let attractionName = document.createElement('h6');
  let nameNode = document.createTextNode(`${data.data[i].name}`);
  attractionName.appendChild(nameNode);
  attractionName.className = "attraction_name";
  attractionNameGroupInside.appendChild(attractionName);
  // div infos 
  let infos = document.createElement('div');
  infos.className = "infos";
  attractionInside.appendChild(infos);
  // h6 mrt_station category 
  let infosInside = document.querySelector(`.attraction:nth-child(${index+1}) > .infos`);
  let mrt_station = document.createElement('h6');
  let mrtNode = document.createTextNode(`${data.data[i].mrt}`);
  mrt_station.appendChild(mrtNode);
  mrt_station.className = "mrt_station";
  infosInside.appendChild(mrt_station);

  let category = document.createElement('h6');
  let categoryNode = document.createTextNode(`${data.data[i].category}`);
  category.appendChild(categoryNode);
  category.className = "category";
  infosInside.appendChild(category);
}


/*  create Error with appendChild  */
function createError(err){
  let attractionsGroup = document.querySelector(".attractions_group");
  let errMsg = document.createElement('h2');
  let errNode = document.createTextNode(err);
  errMsg.appendChild(errNode);
  errMsg.className= "error_message";
  attractionsGroup.appendChild(errMsg);
}



// default 適合用在主要的
export default {
  catchCategories,
  catchAttractions,
  keywordSelect,
  showCategory,
  page,
  observer,
  target,
  showCt
}