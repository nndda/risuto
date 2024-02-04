import { addItemRow, currencyChange } from "./main";

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

export const sampleGrocery : List = {
  title : "This week's grocery",
  currency : "USD",
  displayUnchecked : true,
  items : [
    {
      name : "Egg",
      qty : 6,
      price : 1.5,
      checked : true,
    },
    {
      name : "Milk",
      qty : 2,
      price : 12.15,
      checked : true,
    },
    {
      name : "Bread",
      qty : 3,
      price : 8.25,
      checked : true,
    },
    {
      name : "Coffee",
      qty : 2,
      price : 5.5,
      checked : false,
    },
  ],
};

export function rows2ListData(rows : HTMLCollectionOf<Element>) {
  let list : List = {
    title : (<HTMLInputElement>document.getElementById("list-title")).value,
    currency : (<HTMLInputElement>document.getElementById("list-currency")).value,
    displayUnchecked : (<HTMLInputElement>document.getElementById("show-not-done")).checked,
    items : [],
  };

  for (let i = rows.length - 1; i >= 0; i--) {
    let item : ListItem = {
      name : (<HTMLInputElement>rows[i].getElementsByClassName("item-name")[0]).value,

      qty : parseInt(
        (<HTMLInputElement>rows[i].getElementsByClassName("item-qty")[0])
        .value, 10
      ),

      price : parseFloat(
        (<HTMLInputElement>rows[i].getElementsByClassName("item-price")[0])
        .value
      ),

      checked : (<HTMLInputElement>rows[i].getElementsByClassName("check-done")[0]).checked
    };

    list.items.push(item)
  }
  return list
}

export function listData2Rows(data : List) {
  const currentRows = document.getElementById("table").getElementsByClassName("row");
  for (let i = currentRows.length - 1; i >= 0; i--) {
    currentRows[i].remove();
  }
  (<HTMLInputElement>document.getElementById("list-title")).value = data.title;
  (<HTMLInputElement>document.getElementById("show-unchecked")).checked = data.displayUnchecked;
  (<HTMLInputElement>document.getElementById("list-currency")).value = data.currency;
  data.items.forEach((item) => {
    addItemRow(item);
  });
  currencyChange();
}

export function storageInit() {
  if (storageHas("saved-data")) {

  }
}