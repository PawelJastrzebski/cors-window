const emptyFn = () => { };
const toJson = JSON.stringify
const fromJson = JSON.parse
const fromJsonSafe = (data: string): any | null => {
    try { return fromJson(data) } catch (_) { return null }
}
const W = window;
const D = document;
const getOrign = (url: string): string =>  {
    try {
        return new URL(url).origin
    } catch (e) {
        return `Invalid URL: ${url}`
    }
}
const validateOrigin = (msg: MessageEvent<any>, allowedOrigin: string) => {
    if (msg.origin != allowedOrigin) {
        throw new Error(`Invalid message origin: ${msg.origin}, allowed: ${allowedOrigin}`)
    }
}

type Origin = string;
type MsgType = "msg" | "ping" | "host-attach" | "child-open";

// Message
interface Msg {
    i: string // id
    j: string // json
    type: string
}
const msgListen = (id: string, orgin: string, fn: (sender: MessageEventSource | null, msg: Msg) => void) => {
    W.addEventListener("message", (e) => {
        const json: Msg = fromJsonSafe(e.data)
        // validate data format
        if (!!json && !!json.type && json.i === id) {
            validateOrigin(e, orgin)
            fn(e.source, json)
        }
    }, false)
}
const postMsg = (widow: Window | null, origin: string, id: string, type: MsgType, data: string) => {
    const message = {
        i: id,
        j: data,
        type: type
    }
    widow?.postMessage(toJson(message), origin)
}

// --- abstract ---

abstract class Host<T extends object = object,> {
    origin: Origin
    child: Window | null;
    onMessage: (payload: T) => void = emptyFn
    onChildOpen = emptyFn
    onChildAttach = emptyFn
    onChildClose = emptyFn

    public isOpen(): boolean {
        return !!this.child && this.child.closed == false;
    }

    constructor(remoteUrl: string, private id = "1") {
        this.origin = getOrign(remoteUrl)

        // listen on msg
        msgListen(this.id, this.origin, (sender, msg) => {
            if (msg.type === 'msg') {
                this.onMessage?.(fromJson(msg.j))
            }
            if (msg.type === 'child-open') {
                this.onChildOpen?.()
            }
            // re-atache on Ping after refresh
            if (!!sender && this.child == null && msg.type === 'ping') {
                this.child = sender as Window;
                this.onChildAttach?.()
                postMsg(this.child, this.origin, id, "host-attach", "")
            }
        })

        // observer close
        setInterval(() => {
            if (this.child && this.child.closed) {
                this.onChildClose?.()
                this.child = null;
                return;
            }
        }, 100)
    }
    post(payload: T): void {
        postMsg(this.child, this.origin, this.id, "msg", toJson(payload))
    }
}

class Listener<T extends object = object>  {
    origin: Origin
    parent: Window | null;
    onMessage: (payload: T) => void = emptyFn
    onParentOpen = emptyFn
    onParentAttach = emptyFn
    onParentClose = emptyFn

    constructor(private id = "1", parent: Window | null) {
        this.parent = parent;
        setTimeout(() => this.init(), 0)
    }

    public isOpen() {
        return !!this.parent && this.parent.closed == false;
    }

    private init() {
        if (!this.parent) return;
        this.origin = getOrign(D.referrer)
        // listen on msg
        msgListen(this.id, this.origin, (sender, msg) => {
            if (msg.type === 'msg') {
                this.onMessage?.(fromJson(msg.j))
            } else if (msg.type === 'host-attach') {
                this.onParentAttach?.()
            }
        })
        // observer close + ping
        setInterval(() => {
            if (this.parent && this.parent.closed) {
                this.onParentClose?.()
                this.parent = null;
                return;
            }
            postMsg(this.parent, this.origin, this.id, "ping", "")
        }, 100)
        this.onParentOpen?.()
        postMsg(this.parent, this.origin, this.id, "child-open", "")
    }
    post(payload: T): void {
        postMsg(this.parent, this.origin, this.id, "msg", toJson(payload))
    }
}

// --- public utils ----

export interface DialogOptions {
    width: number,
    height: number,
    target?: string,
    centered?: boolean,
    xMove?: number,
    yMove?: number,
    options?: string
}

export const newDialog = (url: string, options?: DialogOptions): Window | null => {
    const opt: DialogOptions = options ?? { width: 600, height: 400 }
    const dualScreenLeft = W.screenLeft != undefined ? W.screenLeft : (screen as any).left
    const dualScreenTop = W.screenTop != undefined ? W.screenTop : (screen as any).top

    const IW = W.innerWidth
    const IH = W.innerHeight
    const DE = D.documentElement

    let width = IW ? IW : DE.clientWidth ? DE.clientWidth : screen.width
    let height = IH ? IH : DE.clientHeight ? DE.clientHeight : screen.height

    let left = dualScreenLeft + (opt.xMove ?? 0)
    let top = dualScreenTop + (opt.yMove ?? 0)
    if (opt.centered ?? true) {
        left += (width / 2) - (opt.width / 2)
        top += (height / 2) - (opt.height / 2)
    }

    const target = opt.target ?? "_blank"
    const dialog = W.open(
        url,
        target,
        `width=${opt.width}, height=${opt.height} top=${top}, left=${left}, ${opt.options ?? "resize=yes"}`
    );
    if (dialog?.focus) dialog.focus();
    return dialog;
}

// --- public ----

// parent -> iframe
export class IframeHost<T extends object = object> extends Host<T> {

    constructor(iFrame: HTMLIFrameElement, id = "1") {
        super(iFrame.src, id + "_i")
        if (this.child) return;
        this.child = iFrame.contentWindow
    }

}

// iframe -> parent
export class IframeWindow<T extends object = object> extends Listener<T>  {
    constructor(id = "1") {
        super(id + "_i", W.top)
    }
}

/**
 * parent -> dialog/window
 */
export class DialogHost<T extends object = object> extends Host<T> {

    constructor(remoteUrl: string, id = "1", options?: DialogOptions) {
        super(remoteUrl, id + "_d")
        setTimeout(() => {
            if (this.child) return;
            this.child = newDialog(remoteUrl, options)
        }, 250)
    }
}

/**
 *   dialog/window -> parent 
 */
export class DialogWindow<T extends object = object> extends Listener<T>  {
    constructor(id = "1") {
        super(id + "_d", W.opener)
    }
}
