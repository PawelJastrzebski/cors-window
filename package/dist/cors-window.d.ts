interface DialogOptions {
    width: number;
    height: number;
    target?: string;
    centered?: boolean;
    moveRight?: number;
    moveDown?: number;
    options?: string;
}
declare const newDialog: (url: string, options?: DialogOptions) => Window | null;
declare class WindowHost {
    private id;
    childOrigin: string;
    childWindow: Window | null;
    onMessage: <T extends object>(data: T) => void;
    onChildClose: () => void;
    isConnected(): boolean;
    constructor(remoteUrl: string, id?: string, options?: DialogOptions);
    postMessage<T extends object>(data: T): void;
}
declare class WindowDialog {
    private id;
    parentOrigin: string;
    opener: Window | null;
    onMessage: <T extends object>(data: T) => void;
    onAttache: () => void;
    onParentClose: () => void;
    isConnected(): boolean;
    constructor(id?: string);
    postMessage<T extends object>(data: T): void;
}

export { type DialogOptions, WindowDialog, WindowHost, newDialog };
