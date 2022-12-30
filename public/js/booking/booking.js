import nav from "../nav/nav_setting.js"
import booking from "./booking_func.js"

window.showSignIn = nav.showSignIn;
window.showSignUp = nav.showSignUp;
window.toggleSignIn = nav.toggleSignIn;
window.signIn = nav.signIn;
window.signUp = nav.signUp;
window.signOut = nav.signOut;
window.toBooking = nav.toBooking;
window.onSubmit = onSubmit;

nav.loadWaitingSvg();
nav.hideDisplayBug();
booking.jumpToNextInput();
booking.verifyInfo();

(async()=>{
  await nav.auth(false, "booking");
})()

TPDirect.setupSDK(126918, 'app_8IzkYYi3HClcpe5z1lKzaX52Bin3GtVoLGShaD5SK2ZrFoYAjfUo6z27ceQR', 'sandbox')

let fields = {
  number: {
    // css selector
    element: '#card-number',
    placeholder: '**** **** **** ****'
  },
  expirationDate: {
    // DOM object
    element: document.getElementById('card-expiration-date'),
    placeholder: 'MM / YY'
  },
  ccv: {
    element: '#card-ccv',
    placeholder: 'ccv'
  }
}
TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    'input': {
      'color': 'gray'
    },
    // Styling ccv field
    'input.ccv': {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    'input.expiration-date': {
      // 'font-size': '16px'
    },
    // Styling card-number field
    'input.card-number': {
      // 'font-size': '16px'
    },
    // style focus state
    ':focus': {
      // 'color': 'black'
    },
    // style valid state
    '.valid': {
      'color': 'green'
    },
    // style invalid state
    '.invalid': {
      'color': 'red'
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    '@media screen and (max-width: 400px)': {
      'input': {
        'color': 'orange'
      }
    }
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11
  }
})


TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    // submitButton.removeAttribute('disabled')
  } else {
    // Disable submit Button to get prime.
    // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
  if (update.cardType === 'visa') {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
})


function onSubmit(event) {
  // event.preventDefault()

  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    // alert('can not get prime')
    const tpfield = document.querySelectorAll(".tpfield");
    tpfield.forEach((item)=>{
      item.style = "border: 1px solid red";
      setTimeout(()=>{
        item.style = "border: 1px solid #E8E8E8";
      }, 700)
    })
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert('get prime error ' + result.msg);
      return;
    }
    // alert('get prime 成功，prime: ' + result.card.prime)
    // send prime to your server, to pay with Pay by Prime API .

    let totalCost = document.querySelector(".total_cost");
    let contactName = document.querySelector(".contact_name");
    let contactEmail = document.querySelector(".contact_email");
    let contactMobile = document.querySelector(".contact_mobile");

    let booking_items = document.querySelectorAll(".booking_item"); 
    let attractionNames = document.querySelectorAll(".attraction_name");
    let addresses = document.querySelectorAll(".address span");
    let imgs = document.querySelectorAll(".img");
    let dates = document.querySelectorAll(".date span");
    let times = document.querySelectorAll(".time span");
    let costs = document.querySelectorAll(".booking_item .cost");

    let trips = [];
    booking_items.forEach((item, i) => {
      let tripdetails = {
        "attraction": {
          "id": item.getAttribute("attraction_id"),
          "name": attractionNames[i].textContent,
          "address": addresses[i].textContent,
          "image": imgs[i].getAttribute("style").split('"')[1],
          "price": costs[i].textContent.split(" ")[2],
        },
        "date": dates[i].textContent,
        "time": times[i].textContent,
      }
      trips.push(tripdetails);
    })

    fetch("/api/orders", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "prime": result.card.prime,
        "order": {
          "totalPrice": totalCost.textContent,
          "trips": trips,
          "contact": {
            "name": contactName.value,
            "email": contactEmail.value,
            "phone": contactMobile.value
          }
        }
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.error){
        window.location = "/";
      }
      if(data.data){
        let lst = booking.bidLst;
        booking.deleteBooking(lst, "order");
        window.location = `/thankyou?number=${data.data.number}`;
      }
    })

    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  })
}


/*
TPDirect.ccv.getPrime().then((response) => {
  console.log(response)
}).catch((error) => {
  console.log(error)
})
*/



