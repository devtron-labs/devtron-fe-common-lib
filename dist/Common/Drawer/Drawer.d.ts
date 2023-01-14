import React from 'react';
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
declare const Drawer: React.FC<drawerInterface>;
export default Drawer;
