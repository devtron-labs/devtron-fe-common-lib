import React from 'react';
export declare class ToastBody extends React.Component<{
    title: string;
    subtitle?: string;
}> {
    render(): JSX.Element;
}
export declare class ToastBody3 extends React.Component<{
    text: string;
    onClick: (...args: any[]) => void;
    buttonText: string;
}> {
    render(): JSX.Element;
}
export declare class ToastBodyWithButton extends React.Component<{
    title: string;
    subtitle?: string;
    onClick: (...args: any[]) => void;
    buttonText: string;
}> {
    render(): JSX.Element;
}
export declare const toastAccessDenied: (subtitle?: string) => React.ReactText;
