const orderNumber = document.querySelector(".order_number");

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let value = params.number;

let setValue = ()=>{
  orderNumber.textContent = value;
}

function getOrder(orderNumber){
  fetch(`/api/order/${orderNumber}`)
  .then((response) => response.json())
  .then((data) => {
    if(data.data){
      console.log(data.data);
      return
    }
    if(data.error){
      window.location = "/";
    }
  })
}

export default {
  setValue,
  getOrder,
  value,
}