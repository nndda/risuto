const d = document;

import "./storage";

import { initColors } from "./theme";
initColors();

import { Currency, getCurrency, initCurrencySelector } from "./currency";
import { ListItem, rows2ListData, listData2Rows, sampleGrocery } from "./storage";

let currentCurrency : string = "IDR";
let curr : Currency = getCurrency();

const currChangeBtn = <HTMLSelectElement>d.getElementById("list-currency");
currChangeBtn.onchange = () => {
  currencyChange();
};
export function currencyChange() {
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
}
initCurrencySelector(currChangeBtn);

const addItem = <HTMLButtonElement>d.getElementById("add-item");
const rowTemplate = d.getElementById("row-template");
const table = d.getElementById("table");
const total = d.getElementById("total");
const totalChecked = d.getElementById("total-checked");
const toggleShowUncheckedButton = <HTMLInputElement>d.getElementById("show-unchecked");

const hiddenRowClassName = "hidden-collapse-height";

const itemsTotalChecked = d.getElementById("items-checked");
const itemsTotalUnchecked = d.getElementById("items-unchecked");

function toggleShowUnchecked() {
  const rows = table.getElementsByClassName("row");
  for (let i = rows.length - 1; i >= 0; i--) {
    if (toggleShowUncheckedButton.checked) {
      rows[i].classList.remove(hiddenRowClassName);
    }
    else {
      rows[i].classList.toggle(hiddenRowClassName,
        (
          <HTMLInputElement>rows[i]
          .getElementsByClassName("check-done")[0])
          .checked
        );
    }
  }
}
toggleShowUncheckedButton.oninput = () => {
  toggleShowUnchecked();
};

export function addItemRow(item : ListItem = {
  name : "",
  qty : 0,
  price : 0,
  checked : false,
}) {
  let new_row = <HTMLElement>rowTemplate.cloneNode(true);
  new_row.removeAttribute("id");
  new_row.classList.remove(hiddenRowClassName);
  new_row.setAttribute("data-checked", `${item.checked}`);

  const checkButton = <HTMLInputElement>new_row.getElementsByClassName("check-done")[0];
  const itemPrice = <HTMLInputElement>new_row.getElementsByClassName("item-price")[0];
  const itemName = <HTMLInputElement>new_row.getElementsByClassName("item-name")[0];
  const itemQty = <HTMLInputElement>new_row.getElementsByClassName("item-qty")[0];

  checkButton.checked = item.checked;
  itemPrice.value = `${item.price}`;
  itemName.value = `${item.name}`;
  itemQty.value = `${item.qty}`;

  checkButton.oninput = () => {checkRow(new_row);};
  itemPrice.oninput = () => {checkErr(new_row);};
  itemQty.oninput = () => {checkErr(new_row);};

  const buttonDelete = (<HTMLButtonElement>new_row.getElementsByClassName("button-del")[0]);
  buttonDelete.onclick = () => {removeRow(new_row);};

  new_row.setAttribute("data-checked", `${item.checked}`);

  buttonDelete.classList.toggle(hiddenRowClassName,
    table.getElementsByClassName("row").length < 1
  )

  table.appendChild(new_row);
  checkErr(new_row);
}

// prob. not a gud idea
function removeRow(row : HTMLElement) {
  row.remove();
  calcTotal();
}
function checkRow(row : HTMLElement) {
  row.setAttribute(
    "data-checked",
    `${(
      <HTMLInputElement>row.getElementsByClassName("check-done")[0]
    ).checked}`
  )
  if (toggleShowUncheckedButton.checked != true) {
    row.classList.add(hiddenRowClassName);
  }
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
  let totalOutputChecked = 0;
  for (let i = totals.length - 1; i >= 0; i--) {
    let totalNum = parseFloat(totals[i]
      .getElementsByClassName("item-total-display")[0]
      .getAttribute("data-total-num"));

    if (totals[i].getAttribute("data-checked") === "true") {
      totalOutputChecked += totalNum
    }

    totalOutput += totalNum;
  }
  total.textContent = curr[currentCurrency].format(totalOutput);
  totalChecked.textContent = curr[currentCurrency].format(totalOutputChecked);

  itemsTotalUnchecked.textContent = `${table.getElementsByClassName("row").length}`
  itemsTotalChecked.textContent = `${table.querySelectorAll(".row[data-checked=\"true\"]").length}`
  // console.log(rows2ListData(table.getElementsByClassName("row")));
}

// Initialization
addItemRow();

listData2Rows(sampleGrocery);