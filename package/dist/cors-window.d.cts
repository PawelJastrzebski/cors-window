type Origin = string;
declare abstract class Host<T extends object = object> {
    private id;
    origin: Origin;
    child: Window | null;
    onMessage: (payload: T) => void;
    onChildOpen: () => void;
    onChildAttach: () => void;
    onChildClose: () => void;
    isOpen(): boolean;
    constructor(remoteUrl: string, id?: string);
    post(payload: T): void;
}
declare class Listener<T extends object = object> {
    private id;
    origin: Origin;
    parent: Window | null;
    onMessage: (payload: T) => void;
    onParentOpen: () => void;
    onParentAttach: () => void;
    onParentClose: () => void;
    constructor(id: string, parent: Window | null);
    isOpen(): boolean;
    private init;
    post(payload: T): void;
}
interface DialogOptions {
    width: number;
    height: number;
    target?: string;
    centered?: boolean;
    xMove?: number;
    yMove?: number;
    options?: string;
}
declare const newDialog: (url: string, options?: DialogOptions) => Window | null;
declare class IframeHost<T extends object = object> extends Host<T> {
    constructor(iFrame: HTMLIFrameElement, id?: string);
}
declare class IframeWindow<T extends object = object> extends Listener<T> {
    constructor(id?: string);
}
/**
 * parent -> dialog/window
 */
declare class DialogHost<T extends object = object> extends Host<T> {
    constructor(remoteUrl: string, id?: string, options?: DialogOptions);
}
/**
 *   dialog/window -> parent
 */
declare class DialogWindow<T extends object = object> extends Listener<T> {
    constructor(id?: string);
}

export { DialogHost, type DialogOptions, DialogWindow, IframeHost, IframeWindow, newDialog };
