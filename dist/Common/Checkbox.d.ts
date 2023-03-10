import { Component } from 'react';
export declare enum CHECKBOX_VALUE {
    CHECKED = "CHECKED",
    INTERMEDIATE = "INTERMEDIATE"
}
export interface CheckboxProps {
    onChange: (event: any) => void;
    isChecked: boolean;
    value: 'CHECKED' | 'INTERMEDIATE';
    disabled?: boolean;
    tabIndex?: number;
    rootClassName?: string;
    onClick?: (event: any) => void;
    id?: string;
}
export declare class Checkbox extends Component<CheckboxProps> {
    render(): JSX.Element;
}
