import { DialogHost } from "./cors-window.js";

const _print = (msg, id) =>  document.getElementById(id).append(msg + "\n")
const print = (msg) =>  _print(msg, "print")
const print_iframe = (msg) =>  _print(msg, "print_iframe")

const host = new DialogHost("http://localhost:7702", "1", {width: 900, height: 600})
host.onMessage = (data) => {
    console.log("child", data)
    print("child: " + JSON.stringify(data))
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
    host.post({ id: i++, sender: "host", data: "to Dialog" })
}, 4000)


import { IframeHost } from "./cors-window.js";
window.onload = () => {
    let frame = document.getElementsByTagName('iframe')[0]
    const host = new IframeHost(frame)
    host.onMessage = (data) => {
        console.log("child", data)
        print_iframe("child: " + JSON.stringify(data))
    }

    let i = 0;
    setInterval(() => {
        host.post({ id: i++, sender: "host", data: "to Iframe" })
    }, 4000)

}