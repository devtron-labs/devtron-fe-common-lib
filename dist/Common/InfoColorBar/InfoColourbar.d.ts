import React, { CSSProperties } from 'react';
import './infoColourBar.scss';
interface InfoColourBarType {
    message: React.ReactNode;
    classname: string;
    Icon: any;
    iconClass?: string;
    iconSize?: number;
    renderActionButton?: () => JSX.Element;
    linkText?: React.ReactNode;
    redirectLink?: string;
    linkOnClick?: () => void;
    linkClass?: string;
    internalLink?: boolean;
    styles?: CSSProperties;
}
declare function InfoColourBar({ message, classname, Icon, iconClass, iconSize, renderActionButton, linkText, redirectLink, linkOnClick, linkClass, internalLink, styles, }: InfoColourBarType): JSX.Element;
export default InfoColourBar;
