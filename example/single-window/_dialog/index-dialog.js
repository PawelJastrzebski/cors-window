import { WindowDialog } from "./cors-window.js";

function print(msg) {
    const div = document.getElementById("print");
    div.append(msg)
    div.append("\n")
}

const dialog = new WindowDialog();
dialog.onAttache = () => {
    console.log("parent refreshed the window")
    print("parent refreshed the window")
}
dialog.onMessage = (data) => {
    console.log("parent sent message", data)
    print("parent sent message: " + JSON.stringify(data))
}
dialog.onParentClose = () => {
    console.log("parent closed the window")
    print("parent closed the window")
}


let i = 0;
setInterval(() => {
    dialog.postMessage({ id: i++, sender: "dialog", data: "data from dialog" })
}, 1000)

print(`isConnected ${dialog.isConnected()}`)