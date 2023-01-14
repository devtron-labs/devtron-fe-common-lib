import { Component } from 'react';
export declare class ErrorScreenManager extends Component<{
    code?: number;
    reload?: (...args: any[]) => any;
    subtitle?: string;
    reloadClass?: string;
}> {
    getMessage(): JSX.Element | "Bad Request" | "Unauthorized" | "Not Found" | "Internal Server Error" | "Bad Gateway" | "Service Temporarily Unavailable";
    render(): JSX.Element;
}
export declare class ErrorScreenNotAuthorized extends Component<{
    subtitle: string;
}> {
    render(): JSX.Element;
}
