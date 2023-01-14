import React from 'react';
export interface OpaqueModalProps {
    className?: string;
    onHide?: any;
    noBackground?: boolean;
}
export declare class OpaqueModal extends React.Component<OpaqueModalProps> {
    modalRef: HTMLElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactPortal;
}
