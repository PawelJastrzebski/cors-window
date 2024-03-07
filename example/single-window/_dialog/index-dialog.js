import { DialogWindow, IframeWindow } from "./cors-window.js";

const _print = (msg, id) =>  document.getElementById(id).append(msg + "\n")
const print = (msg) =>  _print(msg, "print")
const print_iframe = (msg) =>  _print(msg, "print_iframe")

const dialog = new DialogWindow();
dialog.onMessage = (data) => {
    console.log("parent", data)
    print("parent: " + JSON.stringify(data))
}
dialog.onParentOpen = () => {
    console.log("parent opend this window")
    print("parent opend this window")
}
dialog.onParentAttach = () => {
    console.log("parent refreshed the window")
    print("parent refreshed the window")
}
dialog.onParentClose = () => {
    console.log("parent closed the window")
    print("parent closed the window")
}

let i = 0;
setInterval(() => {
    dialog.post({ id: i++, sender: "dialog", data: "data from dialog" })
}, 1000)


const parent = new IframeWindow();
parent.onMessage = (data) => {
    console.log("parent", data)
    print_iframe("parent: " + JSON.stringify(data))
}

let x = 0;
setInterval(() => {
    parent.post({ id: x++, sender: "iframe", data: "data from iFrame" })
}, 1000)