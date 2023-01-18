import { Component } from 'react';
export interface DialogFormProps {
    className: string;
    title: string;
    isLoading: boolean;
    closeOnESC?: boolean;
    close: (event: any) => void;
    onSave: (event: any) => void;
    headerClassName?: string;
}
export declare class DialogForm extends Component<DialogFormProps> {
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    escFunction(event: any): void;
    render(): JSX.Element;
}
export declare class DialogFormSubmit extends Component<{
    tabIndex: number;
}> {
    render(): JSX.Element;
}
