import React from 'react';
export declare const BreadcrumbContext: React.Context<any>;
interface Breadcrumb {
    to: string;
    name: string;
    className?: string;
}
interface UseBreadcrumbState {
    breadcrumbs: Breadcrumb[];
    setCrumb: (props: {
        [key: string]: any;
    }) => void;
    resetCrumb: (props: string[]) => void;
}
interface AdvancedAlias {
    component: any;
    linked: boolean;
}
interface UseBreadcrumbProps {
    sep?: string;
    alias?: {
        [key: string]: AdvancedAlias | any;
    };
}
type UseBreadcrumbOptionalProps = UseBreadcrumbProps | null;
export declare function useBreadcrumb(props?: UseBreadcrumbOptionalProps, deps?: any[]): UseBreadcrumbState;
interface Breadcrumbs {
    breadcrumbs: Breadcrumb[];
    sep?: string;
    className?: string;
}
export declare const BreadCrumb: React.FC<Breadcrumbs>;
export {};
