import { Component } from 'react';
export interface RadioGroupItemProps {
    value: string;
}
export declare class RadioGroupItem extends Component<RadioGroupItemProps> {
    render(): JSX.Element;
}
export interface RadioGroupProps {
    value: string;
    name: string;
    disabled?: boolean;
    onChange: (event: any) => void;
    className?: string;
}
export declare class RadioGroup extends Component<RadioGroupProps> {
    render(): JSX.Element;
}
