import React from 'react';
declare const Store: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const BreadcrumbContext: React.Context<{
    state: {
        alias: {};
    };
    setState: any;
}>;
export declare function useBreadcrumbContext(): {
    state: {
        alias: {};
    };
    setState: any;
};
export default Store;
