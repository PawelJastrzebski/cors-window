# cors-window
Cross-origin window communication based on `window.postMessage()`

# Example
### Host
```ts
const host = new WindowHost("http://localhost:4030");
host.onMessage = (data) => {
  console.log("child sent msg", data)
}
host.onChildClose = () => {
  console.log("child window closed")
}
setInterval(() => {
  host.postMessage({ type: "Ok", data: "data from host" })
}, 1500)
```

### Dialog

```ts 
const dialog = new WindowDialog();
dialog.onAttache = () => {
    console.log("parent refreshed the window")
}
dialog.onMessage = (data) => {
    console.log("parent sent message", data)
}
dialog.onParentClose = () => {
    console.log("parent closed the window")
}
setInterval(() => {
    dialog.postMessage({ type: "ok" })
}, 1500)
```