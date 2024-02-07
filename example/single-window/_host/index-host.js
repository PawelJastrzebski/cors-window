import { WindowHost } from "./cors-window.js";

function print(msg) {
    const div = document.getElementById("print");
    div.append(msg)
    div.append("\n")
}

const host = new WindowHost("http://localhost:7702")
host.onMessage = (data) => {
    console.log("child sent msg", data)
    print("child sent msg: " + JSON.stringify(data))
}
host.onChildAttach = () => {
    console.log("host has attached to existing window")
    print("host has attached to existing window")
}
host.onChildOpen = () => {
    console.log("child opened a new window")
    print("child opened a new window")
}
host.onChildClose = () => {
    console.log("child window closed")
    print("child window closed")
}

let i = 0;
setInterval(() => {
    host.postMessage({ id: i++, sender: "host", data: "data from host" })
}, 4000)
