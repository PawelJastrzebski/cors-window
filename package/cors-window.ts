export interface DialogOptions {
    width: number,
    height: number,
    target?: string,
    centered?: boolean,
    xMove?: number,
    yMove?: number,
    options?: string
}

const toJson = JSON.stringify
const fromJson = JSON.parse
const W = window;
const D = document;
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
const getOrign = (url: string): string => {
    return new URL(url).origin
}
const validateOrigin = (msg: MessageEvent<any>, allowedOrigin: string) => {
    if (msg.origin != allowedOrigin) {
        throw new Error(`Invalid message origin: ${msg.origin}, allowed: ${allowedOrigin}`)
    }
}

// Message
type Origin = string;
type MsgType = "msg" | "ping" | "host-attach" | "child-open";
class Msg {
    constructor(
        private readonly i: string, // id
        private readonly j: string, // json
        readonly type: MsgType // type
    ) { }

    parseJson(): object {
        return fromJson(this.j)
    }

    post(widow: Window | null, origin: string) {
        if (!!widow) {
            widow.postMessage(toJson(this), origin)
        }
    }

    static new(id: string, type: MsgType): Msg {
        return new Msg(id, "", type);
    }

    static newMsg<T extends object>(id: string, data: T): Msg {
        return new Msg(id, toJson(data), "msg");
    }

    private static unwrap(data: string): Msg | null {
        const json = fromJson(data);
        if ('type' in json && 'j' in json) {
            return Object.assign(new Msg("null", "", "msg"), json)
        }
        return null
    }

    static listen(id: string, orgin: string, fn: (sender: MessageEventSource | null, msg: Msg) => void) {
        W.addEventListener("message", (e) => {
            validateOrigin(e, orgin)
            const palyload = Msg.unwrap(e.data);
            if (!palyload || palyload.i != id) return;
            fn(e.source, palyload)
        }, false)
    }
}

export class WindowHost {
    origin: Origin
    child: Window | null;
    onMessage = <T extends object>(data: T) => { }
    onChildOpen = () => { }
    onChildAttach = () => { }
    onChildClose = () => { }

    public isConnected() {
        return !!this.child && this.child.closed == false;
    }

    constructor(remoteUrl: string, private id = "1", options?: DialogOptions) {
        this.origin = getOrign(remoteUrl)
        setTimeout(() => {
            if (this.child) return;
            this.child = newDialog(remoteUrl, options)
        }, 250)

        // listen on msg
        Msg.listen(this.id, this.origin, (sender, msg) => {
            if (msg.type === 'msg') {
                this.onMessage?.(msg.parseJson())
            }
            if (msg.type === 'child-open') {
                this.onChildOpen?.()
            }
            // reatache on Ping after refresh
            if (this.child == null && msg.type === 'ping') {
                this.child = sender as any;
                this.onChildAttach?.()
                Msg.new(id, "host-attach").post(this.child, this.origin)
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
    postMessage<T extends object>(data: T): void {
        Msg.newMsg(this.id, data).post(this.child, this.origin)
    }
}

export class WindowDialog {
    origin: Origin
    parent: Window | null = W.opener
    onMessage = <T extends object>(data: T) => { }
    onParentOpen = () => { }
    onParentAttach = () => { }
    onParentClose = () => { }

    public isConnected() {
        return !!this.parent && this.parent.closed == false;
    }

    constructor(private id = "1") {
        setTimeout(() => this.initialize(), 0)
    }

    private initialize() {
        if (!this.parent) return;
        this.origin = getOrign(D.referrer)
        // listen on msg
        Msg.listen(this.id, this.origin, (sender, msg) => {
            if (msg.type === 'msg') {
                this.onMessage?.(msg.parseJson())
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
            Msg.new(this.id, "ping").post(this.parent, this.origin)
        }, 100)
        this.onParentOpen?.()
        Msg.new(this.id, "child-open").post(this.parent, this.origin)
    }
    postMessage<T extends object>(data: T): void {
        Msg.newMsg(this.id, data).post(this.parent, this.origin)
    }
}