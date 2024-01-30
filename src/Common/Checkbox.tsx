import React, { Component } from 'react'
import { CheckboxProps } from './Types'

/*
Valid States of Checkbox:
1. disabled: true, checked: false, value: XXX
2. disabled: true, checked: true, value: INTERMIDIATE
3. disabled: true, checked: true, value: CHECKED
4. disabled: true, checked: false, value: XXX
5. disabled: false, checked: true,  value: INTERMIDIATE
6. disabled: false, checked: true,  value: CHECKED
*/
export class Checkbox extends Component<CheckboxProps> {
    render() {
        const rootClassName = `${this.props.rootClassName ? this.props.rootClassName : ''}`
        return (
            <label className={`dc__position-rel flex left cursor ${rootClassName}`} onClick={this.props?.onClick}>
                <input
                    type="checkbox"
                    className="form__checkbox"
                    disabled={this.props.disabled}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    tabIndex={this.props.tabIndex}
                    checked={this.props.isChecked}
                    id={this.props.id}
                    data-testid={this.props.dataTestId}
                />
                <span className="form__checkbox-container" data-testid={`${this.props.dataTestId}-chk-span`} />
                <span className="form__checkbox-label">{this.props.children}</span>
            </label>
        )
    }
}
