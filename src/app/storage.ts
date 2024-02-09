import { addItemRow, currentList, cleanRows, listSwitch } from "./main";
import { currencyChange } from "./currency";
import { sampleGrocery } from "../config/sampleList";

const savedListContainer = document.getElementById("saved-list");

export function storageHas(item : string) {
  return localStorage.getItem(item) != null
}

export interface userData {
  listCollections : Array<List>,
  darkMode : boolean,
  accentColor : string,
}

export interface List {
  title : string,
  currency : string,
  displayUnchecked : boolean,
  items : Array<ListItem>,
}

export interface ListItem {
  name : string,
  qty : number,
  price : number,
  checked : boolean,
}

export function row2ListItem(row : HTMLElement) : ListItem {
  return {
      name : (<HTMLInputElement>row.getElementsByClassName("item-name")[0]).value,

      qty : parseInt(
        (<HTMLInputElement>row.getElementsByClassName("item-qty")[0])
        .value, 10
      ),

      price : parseFloat(
        (<HTMLInputElement>row.getElementsByClassName("item-price")[0])
        .value
      ),

      checked : (<HTMLInputElement>row.getElementsByClassName("check-done")[0]).checked
  }
}

export function rows2List(rows : HTMLCollectionOf<Element>) : List {
  let list : List = {
    title : (<HTMLInputElement>document.getElementById("list-title")).value,
    currency : (<HTMLInputElement>document.getElementById("list-currency")).value,
    displayUnchecked : (<HTMLInputElement>document.getElementById("show-unchecked")).checked,
    items : [],
  };

  for (let i = rows.length - 1; i >= 0; i--) {
    let item : ListItem = row2ListItem(<HTMLElement>rows[i]);

    list.items.push(item)
  }
  return list
}

export function listData2Rows(data : List) {
  cleanRows();
  (<HTMLInputElement>document.getElementById("list-title")).value = data.title;
  (<HTMLInputElement>document.getElementById("show-unchecked")).checked = data.displayUnchecked;
  (<HTMLInputElement>document.getElementById("list-currency")).value = data.currency;
  data.items.forEach((item) => {
    addItemRow(item, true);
  });
  currencyChange();
}

function storageInit() {
  if (localStorage.length < 1) {
    localStorage.setItem(
      sampleGrocery.title,
      JSON.stringify(sampleGrocery));
    homeListInit();
  } else {
    storageLoad();
  }
}

export function storageSave() {
  localStorage.setItem(
    currentList.title,
    JSON.stringify(currentList)
  )
}

export function storageLoad() {
  homeListInit();
}

export function homeListInit() {
  savedListContainer.innerHTML = "";
  for (let n = localStorage.length - 1; n >= 0; n--) {
    if (localStorage.key(n) != "_CONFIG") {
      let data : List = JSON.parse(localStorage.getItem(localStorage.key(n)));

      let listBtn = document.createElement("button");
      listBtn.classList.add("button-wide");

      listBtn.setAttribute("data-list-name", data.title)
      listBtn.textContent = data.title;

      listBtn.onclick = () => {
        listSwitch(data);
        // currentListSet(data);
      };

      savedListContainer.append(listBtn);
    }
  };
}

storageInit();