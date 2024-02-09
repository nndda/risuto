import { List } from "../app/storage";

export const sampleGrocery : List = {
  title : "This week's grocery (sample)",
  currency : "USD",
  displayUnchecked : true,
  items : [
    {
      name : "🥚 Egg",
      qty : 6,
      price : 1.5,
      checked : true
    },
    {
      name : "🥛 Milk",
      qty : 2,
      price : 12.15,
      checked : true
    },
    {
      name : "🥖 Bread",
      qty : 3,
      price : 8.25,
      checked : false
    },
    {
      name : "☕ Coffee",
      qty : 2,
      price : 5.5,
      checked : true
    },
    {
      name : "🍪 Cookie",
      qty : 1,
      price : 3.75,
      checked : false
    }
  ]
}