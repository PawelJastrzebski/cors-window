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
type Origin = string;
declare class WindowHost<T extends object = object> {
    private id;
    origin: Origin;
    child: Window | null;
    onMessage: (payload: T) => void;
    onChildOpen: () => void;
    onChildAttach: () => void;
    onChildClose: () => void;
    isOpen(): boolean;
    constructor(remoteUrl: string, id?: string, options?: DialogOptions);
    post(payload: T): void;
}
declare class WindowDialog<T extends object = object> {
    private id;
    origin: Origin;
    parent: Window | null;
    onMessage: (payload: T) => void;
    onParentOpen: () => void;
    onParentAttach: () => void;
    onParentClose: () => void;
    isOpen(): boolean;
    constructor(id?: string);
    private init;
    post(payload: T): void;
}

export { type DialogOptions, WindowDialog, WindowHost, newDialog };
