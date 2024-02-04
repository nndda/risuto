const d = document;

import "./storage";

import { Currency, getCurrency, initCurrencySelector } from "./currency";
import { rows2ListData } from "./storage";
let currentCurrency : string = "IDR";
let curr : Currency = getCurrency();

const currChangeBtn = <HTMLSelectElement>d.getElementById("list-currency");
currChangeBtn.onchange = () => {
  currentCurrency = currChangeBtn.value;

  const itemTotals = table.getElementsByClassName("item-total-display");
  for (let i = itemTotals.length - 1; i >= 0; i--) {
    itemTotals[i].textContent = curr[currentCurrency].format(
      parseFloat(
        itemTotals[i].getAttribute("data-total-num")
      )
    );
  }
  calcTotal();
};
initCurrencySelector(currChangeBtn);

const addItem = <HTMLButtonElement>d.getElementById("add-item");
const rowTemplate = d.getElementById("row-template");
const table = d.getElementById("table");
const total = d.getElementById("total");

function addItemRow() {
  let new_row = <HTMLElement>rowTemplate.cloneNode(true);
  new_row.removeAttribute("id");
  new_row.classList.remove("hidden");

  (<HTMLInputElement>new_row.getElementsByClassName("item-price")[0]
    ).oninput = () => {
    checkErr(new_row);
  };
  (<HTMLInputElement>new_row.getElementsByClassName("item-qty")[0]
    ).oninput = () => {
    checkErr(new_row);
  };
  const buttonDelete = (<HTMLButtonElement>new_row.getElementsByClassName("button-del")[0]);
  buttonDelete.onclick = removeRow;

  buttonDelete.classList.toggle("hidden",
    table.getElementsByClassName("row").length < 1
  )

  table.appendChild(new_row);
  checkErr(new_row);
}

// prob. not a gud idea
function removeRow() {
  this.parentElement.parentElement.remove();
  calcTotal();
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

  for (let i = data.length - 1; i >= 0; i--) {
    let value = parseFloat(data[i].value);
    if (value > 0) {
      if (value <= 0) min += 1;
      valid += 1;
    }
  }

  error = (valid < 2) || (min > 0);

  row.classList.toggle("row-error", error);
  row.classList.toggle("row-valid", !error);
  row.getElementsByClassName("check-done")[0].toggleAttribute("disabled", error);

  calc(row, error);
}

function calc(row : HTMLElement, isError : boolean = false) {
  let totalElem = <HTMLInputElement>row.getElementsByClassName("item-total-display")[0];

  if (isError) {
    totalElem.setAttribute("data-total-num", "0")
  }
  else {
    let qty = parseInt(
      (<HTMLInputElement>row.getElementsByClassName("item-qty")[0]).value, 10);
    let price = parseFloat(
      (<HTMLInputElement>row.getElementsByClassName("item-price")[0]).value);
    let total = qty * price;

    totalElem.setAttribute("data-total-num", `${total}`)
  }

  totalElem.textContent = curr[currentCurrency].format(
    parseFloat(
      totalElem.getAttribute("data-total-num")
    )
  );

  calcTotal();
}

function calcTotal() {
  let totals = table.getElementsByClassName("row-valid");
  let totalOutput = 0;
  for (let i = totals.length - 1; i >= 0; i--) {
    totalOutput += parseFloat(totals[i]
      .getElementsByClassName("item-total-display")[0]
      .getAttribute("data-total-num"));
  }
  total.textContent = curr[currentCurrency].format(totalOutput);
  console.log(rows2ListData(table.getElementsByClassName("row")));
}

// Initialization
addItemRow();