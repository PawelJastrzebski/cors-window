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
declare class WindowHost {
    private id;
    origin: Origin;
    child: Window | null;
    onMessage: <T extends object>(data: T) => void;
    onChildOpen: () => void;
    onChildAttach: () => void;
    onChildClose: () => void;
    isOpen(): boolean;
    constructor(remoteUrl: string, id?: string, options?: DialogOptions);
    post<T extends object>(message: T): void;
}
declare class WindowDialog {
    private id;
    origin: Origin;
    parent: Window | null;
    onMessage: <T extends object>(data: T) => void;
    onParentOpen: () => void;
    onParentAttach: () => void;
    onParentClose: () => void;
    isOpen(): boolean;
    constructor(id?: string);
    private init;
    post<T extends object>(message: T): void;
}

export { type DialogOptions, WindowDialog, WindowHost, newDialog };
