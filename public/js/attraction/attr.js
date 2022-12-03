import lib from "./attr_func.js"


window.morningClick = lib.morningClick;
window.eveningClick = lib.eveningClick;

const id = window.location.href.split("/").pop();

lib.catchAttraction(id);


