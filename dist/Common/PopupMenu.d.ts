/// <reference types="react" />
declare function PopupMenu({ children, onToggleCallback, autoClose, autoPosition }: {
    children?: any;
    onToggleCallback?: any;
    autoClose?: boolean;
    autoPosition?: boolean;
}): any;
declare namespace PopupMenu {
    var Button: ({ children, disabled, rootClassName, tabIndex, onHover, isKebab, }: {
        children?: any;
        disabled?: boolean;
        rootClassName?: string;
        tabIndex?: number;
        onHover?: boolean;
        isKebab?: boolean;
    }) => JSX.Element;
    var Body: ({ children, rootClassName, style, autoWidth, preventWheelDisable }: {
        children?: any;
        rootClassName?: string;
        style?: {};
        autoWidth?: boolean;
        preventWheelDisable?: boolean;
    }) => JSX.Element;
}
export default PopupMenu;
