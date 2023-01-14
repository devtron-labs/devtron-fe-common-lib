/// <reference types="react" />
import './Drawer.scss';
interface drawerInterface {
    position: 'left' | 'right' | 'bottom' | 'top';
    children?: any;
    backdrop?: boolean;
    onClose?: (e: any) => void;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    parentClassName?: string;
    onEscape?: (e?: any) => void;
}
export declare const Drawer: ({ children, position, height, width, minWidth, maxWidth, parentClassName, onEscape, }: drawerInterface) => JSX.Element;
export {};
