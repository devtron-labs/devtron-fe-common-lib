/// <reference types="react" />
export declare function ConfirmationDialog({ className, children }: {
    className?: string;
    children: any;
}): JSX.Element;
export declare namespace ConfirmationDialog {
    var Icon: ({ src, className }: {
        src: any;
        className?: string;
    }) => JSX.Element;
    var Body: ({ title, subtitle, children }: {
        title: any;
        subtitle?: any;
        children?: any;
    }) => JSX.Element;
    var ButtonGroup: ({ children }: {
        children: any;
    }) => JSX.Element;
}
