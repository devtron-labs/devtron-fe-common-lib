/// <reference types="react" />
declare function PopupMenu({ children, onToggleCallback, autoClose }: {
    children?: any;
    onToggleCallback?: any;
    autoClose?: boolean;
}): any;
declare namespace PopupMenu {
    var Button: ({ children, disabled, rootClassName, tabIndex, onHover, isKebab }: {
        children?: any;
        disabled?: boolean;
        rootClassName?: string;
        tabIndex?: number;
        onHover?: boolean;
        isKebab?: boolean;
    }) => JSX.Element;
    var Body: ({ children, rootClassName, style, autoWidth }: {
        children?: any;
        rootClassName?: string;
        style?: {};
        autoWidth?: boolean;
    }) => JSX.Element;
}
export default PopupMenu;
