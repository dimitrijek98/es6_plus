import { Elektrana } from "./elektrana";

const view = document.createElement("div");
view.className = "container";
document.body.appendChild(view);
const elektrana = new Elektrana("Cernobil", view);
console.log(elektrana);