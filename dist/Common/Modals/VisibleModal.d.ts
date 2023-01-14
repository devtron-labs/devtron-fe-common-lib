import React from 'react';
export declare class VisibleModal extends React.Component<{
    className: string;
    parentClassName?: string;
    noBackground?: boolean;
    close?: (e: any) => void;
    onEscape?: (e: any) => void;
}> {
    modalRef: HTMLElement;
    constructor(props: any);
    escFunction(event: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactPortal;
}
