const currencies = [
  ["en-US", "USD", "$ USD"],
  ["ja-JP", "JPY", "¥ JPY"],
  ["id-ID", "IDR", "Rp IDR"],
];
const defaultCurr = "IDR";

export interface Currency {
  [key: string]: Intl.NumberFormat
}
export function getCurrency() {
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
export function initCurrencySelector(element : HTMLSelectElement) {
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
