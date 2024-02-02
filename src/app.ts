const d = document;

function localStorageHas(item : string) {
  return localStorage.getItem(item) != null
}

interface Currency {
    [key: string]: Intl.NumberFormat
}
let currentCurrency : string = "IDR";
let curr : Currency = {};

[
  ["en-US", "USD"],
  ["ja-JP", "JPY"],
  ["id-ID", "IDR"],
].forEach(
  (value : string[]) => {
    curr[<string>value[1]] = new Intl.NumberFormat(<string>value[0], {
      style: "currency",
      currency: value[1],
      minimumFractionDigits: 0,
      maximumFractionDigits: ( value[1] == "IDR" ) ? 0 : 2,
    });
  }
);

const addItem = d.getElementById("add-item");
const rowTemplate = d.getElementById("row-template");
const table = d.getElementById("table");
const total = d.getElementById("total");

function addItemRow() {
  let new_row = <HTMLElement>rowTemplate.cloneNode(true);
  new_row.removeAttribute("id");
  new_row.classList.remove("hidden");

  table.appendChild(new_row);
  checkErr(new_row);
}

addItem.onclick = () => {
  addItemRow();
};

function checkErr(row : HTMLElement) {
  let data : Array<HTMLInputElement> = [
    <HTMLInputElement>row.getElementsByClassName("item-qty")[0],
    <HTMLInputElement>row.getElementsByClassName("item-price")[0],
  ];
  let valid = 0;
  let min = 0;
  let error = false;

  for (var i = data.length - 1; i >= 0; i--) {
    let value = parseInt(data[i].value, 10);
    if (value > 0) {
      if (value <= 0) min += 1;
      valid += 1;
    }
  }

  error = (valid < 2) || (min > 0);
  // console.log(error);

  row.classList.toggle("row-error", error);
  row.getElementsByClassName("item-total")[0].classList.toggle("row-valid", !error);
  row.getElementsByClassName("check-done")[0].toggleAttribute("disabled", error);
  if (!error) {
    calc(row);
  }
}

function calc(row : HTMLElement) {
  let qty = parseInt(
    (<HTMLInputElement>row.getElementsByClassName("item-qty")[0]).value, 10);
  let price = parseInt(
    (<HTMLInputElement>row.getElementsByClassName("item-price")[0]).value, 10);
  let totalElem = <HTMLInputElement>row.getElementsByClassName("row-valid")[0];
  totalElem.textContent = `${qty * price}`;
  calcTotal();
}

function calcTotal() {
  let totals = table.getElementsByClassName("row-valid");
  let totalsDisplay = table.getElementsByClassName("item-total-display");
  let totalOutput = 0;
  for (var i = totals.length - 1; i >= 0; i--) {
    let num = parseInt(totals[i].textContent, 10);
    totalOutput += num;
    totalsDisplay[i].textContent = curr[currentCurrency].format(num);
  }
  total.textContent = curr[currentCurrency].format(totalOutput);
}

function saveData() {
  
}

function initStorage() {
  if (localStorageHas("saved-data")) {

  }
}

// Initialization
addItemRow();