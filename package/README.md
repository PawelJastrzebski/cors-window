# cors-window
Cross-origin window communication based on `window.postMessage()`

# Example
### Host
```ts
const host = new WindowHost("http://localhost:7702")
host.onMessage = (data) => {
    console.log("child sent msg", data)
}
host.onChildAttach = () => {
    console.log("host has attached to existing window")
}
host.onChildOpen = () => {
    console.log("child opened a new window")
}
host.onChildClose = () => {
    console.log("child window closed")
}
setInterval(() => {
  host.post({ type: "ok", data: "data from host" })
}, 1500)
```

### Dialog
```ts 
const dialog = new WindowDialog();
dialog.onMessage = (data) => {
    console.log("parent sent message", data)
}
dialog.onParentOpen = () => {
    console.log("parent opend this window")
}
dialog.onParentAttach = () => {
    console.log("parent refreshed the window")
}
dialog.onParentClose = () => {
    console.log("parent closed the window")
}
setInterval(() => {
  dialog.post({ type: "ok", data: "data from dialog" })
}, 1500)
```