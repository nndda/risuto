const colors = [
    "#eeeeee",
    "#a3e148",
    "#4eefff",
    "#ddb37d",
];

const buttonTheme = document.getElementById("button-theme-color");
const themeColorDropdown = <HTMLElement>document.getElementsByClassName("theme-color-dropdown")[0];

buttonTheme.onclick = () => {
    themeColorDropdown.classList.toggle("collapse-height");
    console.log(themeColorDropdown.style.height);
};

export function initColors() {
    colors.forEach((n) => {
        let col = document.createElement("button");
        col.classList.add("button-icon", "theme-item");
        col.style.background = n;
        col.onclick = () => {
            changeTheme(n)
        };
        themeColorDropdown.appendChild(col);
    })
}


function changeTheme(color : string) {
    document.body.style.setProperty("--accent-color", color)
}