import React from 'react';
interface ProgressingProps {
    pageLoader?: boolean;
    loadingText?: string;
    size?: number;
    fullHeight?: boolean;
    theme?: 'white' | 'default';
    styles?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Progressing({ pageLoader, size, theme, styles }: ProgressingProps): JSX.Element;
export declare function DetailsProgressing({ loadingText, size, fullHeight, children, styles, }: ProgressingProps): JSX.Element;
export {};
