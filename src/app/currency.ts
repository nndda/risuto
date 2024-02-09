const d = document;

import { table, calcTotal } from "./main";

const currencies = [
  ["en-US", "USD", "$ USD"],
  ["ja-JP", "JPY", "¥ JPY"],
  ["id-ID", "IDR", "Rp IDR"],
];

const defaultCurr = "IDR";

export let currentCurrency : string = "IDR";
export let curr : Currency = getCurrency();

interface Currency {
  [key: string]: Intl.NumberFormat,
}

function getCurrency() {
  let output : Currency = {};
  currencies.forEach(
    (value : string[]) => {
      output[value[1]] = new Intl.NumberFormat(value[0], {
        style: "currency",
        currency: value[1],
        minimumFractionDigits: 0,
        maximumFractionDigits: (value[1] === "IDR") ? 0 : 2,
      });
    }
  );
  return output
}

function initCurrencySelector(element : HTMLSelectElement) {
  currencies.forEach((value) => {
    let option = document.createElement("option");
    option.textContent = value[2];
    option.setAttribute("value", value[1]);
    if (value[1] === defaultCurr) {
      option.setAttribute("selected", "");
    }
    element.appendChild(option);
  });
}

export const currChangeBtn = <HTMLSelectElement>d.getElementById("list-currency");
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