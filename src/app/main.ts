const d = document;

import { initColors } from "./theme";
initColors();

import { curr, currentCurrency, currChangeBtn } from "./currency";
import { List, ListItem, row2ListItem, listData2Rows, storageSave, homeListInit } from "./storage";

const home = d.getElementById("home");
export const savedListContainer = d.getElementById("saved-list");

export const table = d.getElementById("table");
const listContainer = d.getElementById("list-container");

const newListBtn = <HTMLButtonElement>d.getElementById("new-list-btn");
newListBtn.onclick = () => {
  listNew();
}

const backToHomeBtn = <HTMLButtonElement>d.getElementById("back-home-btn");
backToHomeBtn.onclick = () => {
  storageSave();
  cleanRows();
  toggleApp(false);
}

const deleteCurrentListBtn = <HTMLButtonElement>d.getElementById("delete-current-list-btn");
deleteCurrentListBtn.onclick = () => {
  localStorage.removeItem(currentList.title)
  currentList = null;
  homeListInit();
  toggleApp(false);
}

function toggleApp(toApp = true) {
  home.classList.toggle("toggle-app-display", toApp);
  listContainer.classList.toggle("toggle-app-display", !toApp);
}

toggleApp(false);

function listNew() {
  cleanRows();
  toggleApp(true);
  let untitledTitleCounts = 0;

  for (let n = localStorage.length - 1; n >= 0; n--) {
    if (localStorage.key(n).startsWith("Untitled list")) {
      untitledTitleCounts += 1;
    }
  }

  currentList = {
    title : `Untitled list ${untitledTitleCounts}`,
    currency : "IDR",
    displayUnchecked : false,
    items : [],
  };

  listTitleInput.value = currentList.title;
  currChangeBtn.value = currentList.currency;
  toggleShowUncheckedButton.checked = currentList.displayUnchecked;
  addItemRow();
}

export function listSwitch(list : List) {
  cleanRows();
  toggleApp(true);
  currentList = list;
  listData2Rows(currentList);
}

export function cleanRows() {
  table.innerHTML = "";
}

export let currentList : List;
export function currentListSet(list : List) {
  currentList = list;
}

const addItem = <HTMLButtonElement>d.getElementById("add-item");
const rowTemplate = d.getElementById("row-template");
const total = d.getElementById("total");
const totalChecked = d.getElementById("total-checked");
const toggleShowUncheckedButton = <HTMLInputElement>d.getElementById("show-unchecked");

const hiddenRowClassName = "hidden-collapse-height";

const listTitleInput = <HTMLInputElement>d.getElementById("list-title");
listTitleInput.oninput = () => {
  // could be better
  if (listTitleInput.value != "_CONFIG") {
    localStorage.removeItem(currentList.title);
    currentList.title = listTitleInput.value;
    storageSave();
  }
};

// let listTitle : string;
// let disallowedListTitles : Array<string> = [];
// function getStoragelistsTitles() {
//   for (let n = localStorage.length - 1; n >= 0; n--) {
//     let str = localStorage.key(n);
//     if (str != "_CONFIG" && str != listTitle) {
//       disallowedListTitles.push(str);
//     }
//   }
// }
// function validateListTitle() {

// }

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
}, fromStorage = false) {
  let new_row = <HTMLElement>rowTemplate.cloneNode(true);
  new_row.removeAttribute("id");
  new_row.classList.remove(hiddenRowClassName);
  new_row.classList.remove("hidden");
  new_row.setAttribute("data-checked", `${item.checked}`);

  const checkButton = <HTMLInputElement>new_row.getElementsByClassName("check-done")[0];
  const itemName = <HTMLInputElement>new_row.getElementsByClassName("item-name")[0];
  const itemPrice = <HTMLInputElement>new_row.getElementsByClassName("item-price")[0];
  const itemQty = <HTMLInputElement>new_row.getElementsByClassName("item-qty")[0];

  checkButton.checked = item.checked;
  itemName.value = `${item.name}`;
  itemPrice.value = `${item.price}`;
  itemQty.value = `${item.qty}`;

  checkButton.oninput = () => {
    checkRow(new_row);
    updateRow(new_row);
  };
  itemName.oninput = () => {
    updateRow(new_row);
    storageSave();
  };
  itemPrice.oninput = () => {
    checkErr(new_row);
    updateRow(new_row);
  };
  itemQty.oninput = () => {
    checkErr(new_row);
    updateRow(new_row);
  };

  const buttonDelete = (<HTMLButtonElement>new_row.getElementsByClassName("button-del")[0]);
  buttonDelete.onclick = () => {
    removeRow(new_row);
  };

  new_row.setAttribute("data-checked", `${item.checked}`);

  table.appendChild(new_row);
  checkErr(new_row);

  if (!fromStorage) {
    currentList.items.push(row2ListItem(new_row));
  }
}

function updateRow(row : HTMLElement) {
  let idx : number = Array.prototype.indexOf.call(row.parentElement.children, row);
  currentList.items[idx] = row2ListItem(row);
}

function removeRow(row : HTMLElement) {
  let idx : number = Array.prototype.indexOf.call(row.parentElement.children, row);
  currentList.items.splice(idx, 1);
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

export function calcTotal() {
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

  itemsTotalUnchecked.textContent = `${table.getElementsByClassName("row").length}`;
  itemsTotalChecked.textContent = `${table.querySelectorAll(".row[data-checked=\"true\"]").length}`;
  storageSave();
}

localStorage.setItem("_CONFIG", JSON.stringify({}));

// d.getElementById("dbg-print").onclick = () => {
//   console.log(currentList);
// };