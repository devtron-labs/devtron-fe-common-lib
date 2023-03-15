import React from 'react';
import './emptyState.scss';
declare function EmptyState({ children, className }: {
    children: any;
    className?: string;
}): JSX.Element;
declare namespace EmptyState {
    var Image: ({ children }: {
        children: any;
    }) => any;
    var Title: ({ children }: {
        children: any;
    }) => any;
    var Subtitle: ({ children, className }: {
        children: any;
        className?: string;
    }) => JSX.Element;
    var Button: ({ children }: {
        children: any;
    }) => any;
    var Loading: React.FC<{
        text: string;
    }>;
}
export default EmptyState;
