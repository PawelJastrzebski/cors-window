export interface DialogOptions {
    width: number,
    height: number,
    target?: string,
    centered?: boolean,
    moveRight?: number,
    moveDown?: number,
    options?: string
}

export const newDialog = (url: string, options?: DialogOptions): Window | null => {
    const opt: DialogOptions = options ?? { width: 600, height: 400 };
    const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : (screen as any).left;
    const dualScreenTop = window.screenTop != undefined ? window.screenTop : (screen as any).top;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let left = 0;
    let top = 0;
    if ((opt.centered ?? true)) {
        left = ((width / 2) - (opt.width / 2)) + dualScreenLeft;
        top = ((height / 2) - (opt.height / 2)) + dualScreenTop;
    } else {
        left = dualScreenLeft + (opt.moveRight ?? 0);
        top = dualScreenTop + (opt.moveDown ?? 0);
    }

    const target = (opt.target ?? "_blank");
    const dialog = window.open(
        url,
        target,
        `width=${opt.width}, height=${opt.height} top=${top}, left=${left}, ${opt.options ?? "resize=yes"}`
    );
    if (dialog?.focus) dialog.focus();
    return dialog;
}

type MsgType = "msg" | "ping" | "host-attach" | "child-open";
class MessageWrapper {
    constructor(
        readonly id: string,
        readonly json: string,
        readonly type: MsgType
    ) { }

    parseJson(): object {
        return JSON.parse(this.json)
    }

    post(widow: Window | null, origin: string) {
        if (!!widow) {
            widow.postMessage(JSON.stringify(this), origin)
        }
    }

    static new(id: string, type: MsgType): MessageWrapper {
        return new MessageWrapper(id, "", type);
    }

    static newMsg<T extends object>(id: string, data: T): MessageWrapper {
        return new MessageWrapper(id, JSON.stringify(data), "msg");
    }

    static unwrap(data: string): MessageWrapper | null {
        const json = JSON.parse(data);
        if ('type' in json && 'json' in json) {
            return Object.assign(new MessageWrapper("null", "", "msg"), json)
        }

        return null
    }
}

const getOrign = (url: string): string => {
    return new URL(url).origin
}

const validateOrigin = (msg: MessageEvent<any>, allowedOrigin: string) => {
    if (msg.origin != allowedOrigin) {
        throw new Error(`Invalid message origin: ${msg.origin}, allowed: ${allowedOrigin}`)
    }
}

export class WindowHost {
    childOrigin: string
    childWindow: Window | null;
    onMessage = <T extends object>(data: T) => { }
    onChildOpen = () => { }
    onChildAttach = () => { }
    onChildClose = () => { }

    public isConnected() {
        return !!this.childWindow && this.childWindow.closed == false;
    }

    constructor(remoteUrl: string, private id = "single", options?: DialogOptions) {
        this.childOrigin = getOrign(remoteUrl)
        setTimeout(() => {
            if (this.childWindow) return;
            this.childWindow = newDialog(remoteUrl, options)
        }, 250)

        // listen on msg
        window.addEventListener("message", (e) => {
            validateOrigin(e, this.childOrigin)
            const palyload = MessageWrapper.unwrap(e.data);
            if (!palyload) return;
            if (palyload.id != this.id) return;

            if (palyload.type === 'msg') {
                this.onMessage?.(palyload.parseJson())
            }
            if (palyload.type === 'child-open') {
                this.onChildOpen?.()
            }
            // reatache on Ping after refresh
            if (this.childWindow == null && palyload.type === 'ping') {
                this.childWindow = e.source as any;
                this.onChildAttach?.()
                MessageWrapper.new(id, "host-attach").post(this.childWindow, this.childOrigin)
            }
        }, false)

        // observer close
        setInterval(() => {
            if (this.childWindow && this.childWindow.closed) {
                this.onChildClose?.()
                this.childWindow = null;
                return;
            }
        }, 100)
    }
    postMessage<T extends object>(data: T): void {
        MessageWrapper.newMsg(this.id, data).post(this.childWindow, this.childOrigin)
    }
}

export class WindowDialog {
    parentOrigin: string = window.document.referrer
    opener: Window | null = window.opener
    onMessage = <T extends object>(data: T) => { }
    onParentOpen = () => { }
    onParentAttach = () => { }
    onParentClose = () => { }

    public isConnected() {
        return !!this.opener && this.opener.closed == false;
    }

    constructor(private id = "single") {
        setTimeout(() => this.initialize(), 0)
    }

    private initialize() {
        if (!this.opener) return;
        this.parentOrigin = getOrign(window.document.referrer)
        // listen on msg
        window.addEventListener("message", (e) => {
            validateOrigin(e, this.parentOrigin)
            const palyload = MessageWrapper.unwrap(e.data);
            if (!palyload) return;
            if (palyload.id != this.id) return;

            if (palyload.type === 'msg') {
                this.onMessage?.(palyload.parseJson())
            } else if (palyload.type === 'host-attach') {
                this.onParentAttach?.()
            }
        }, false)
        // observer close + ping
        setInterval(() => {
            if (this.opener && this.opener.closed) {
                this.onParentClose?.()
                this.opener = null;
                return;
            }
            MessageWrapper.new(this.id, "ping").post(this.opener, this.parentOrigin)
        }, 100)
        this.onParentOpen?.()
        MessageWrapper.new(this.id, "child-open").post(this.opener, this.parentOrigin)
    }
    postMessage<T extends object>(data: T): void {
        MessageWrapper.newMsg(this.id, data).post(this.opener, this.parentOrigin)
    }
}