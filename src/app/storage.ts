export function storageHas(item : string) {
  return localStorage.getItem(item) != null
}

export interface userData {
  listCollections : Array<List>,
  darkMode : boolean,
}

export interface List {
  title : String,
  currency : String,
  displayUnchecked : boolean,
  items : Array<ListItem>,
}

export interface ListItem {
  name : String,
  qty : number,
  price : number,
}

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
    };

    list.items.push(item)
  }
  return list
}

export function storageInit() {
  if (storageHas("saved-data")) {

  }
}