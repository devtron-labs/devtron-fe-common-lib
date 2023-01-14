import React from 'react';
export declare class VisibleModal2 extends React.Component<{
    className: string;
    close?: (e: any) => void;
}> {
    modalRef: HTMLElement;
    constructor(props: any);
    escFunction(event: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactPortal;
}
