import React from 'react';
export declare const Option: (props: any) => JSX.Element;
export declare const SingleSelectOption: (props: any) => JSX.Element;
export declare const MultiValueContainer: (props: any) => JSX.Element;
export declare const ClearIndicator: (props: any) => JSX.Element;
export declare const MultiValueRemove: (props: any) => JSX.Element;
export declare const MultiValueChipContainer: ({ validator, isAllSelected, ...props }: {
    [x: string]: any;
    validator: any;
    isAllSelected?: boolean;
}) => JSX.Element;
export declare const multiSelectStyles: {
    control: (base: any, state: any) => any;
    menu: (base: any, state: any) => any;
    option: (base: any, state: any) => any;
    container: (base: any, state: any) => any;
    valueContainer: (base: any, state: any) => any;
};
interface CustomSelect {
    sortSelected?: boolean;
    options: any[];
    onChange: (...args: any[]) => void;
    value?: any;
    name?: string;
    placeholder?: string;
    className?: string;
    classNamePrefix?: string;
    menuPortalTarget?: any;
    components?: object;
    styles?: object;
    isMulti?: boolean;
    isDisabled?: boolean;
    closeMenuOnSelect?: boolean;
    hideSelectedOptions?: boolean;
    formatOptionLabel?: (...args: any[]) => any;
}
export declare const CustomSelect: React.FC<CustomSelect>;
export {};
