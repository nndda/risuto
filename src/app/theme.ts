const d = document;
const colors = [
    "#eeeeee",
    "#a3e148",
    "#4eefff",
    "#ddb37d",
];

const buttonTheme = d.getElementById("button-theme-color");
const themeColorDropdown = <HTMLElement>d.getElementsByClassName("theme-color-dropdown")[0];

buttonTheme.onclick = () => {
    themeColorDropdown.classList.toggle("collapse-height");
};

export function initColors() {
    colors.forEach((n) => {
        let colorBtn = d.createElement("button");
        colorBtn.classList.add("button-icon", "theme-item");
        colorBtn.style.background = n;
        colorBtn.onclick = () => {
            changeTheme(n)
        };
        themeColorDropdown.appendChild(colorBtn);
    });
}

function changeTheme(color : string) {
    d.body.style.setProperty("--accent-color", color);
    d.body.style.setProperty("--border-color", color + "38");
    d.querySelector("meta[name='theme-color']").setAttribute("content", "#123456");
}