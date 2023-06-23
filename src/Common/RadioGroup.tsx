import React, { Component, createContext } from 'react'
import { RadioGroupItemProps, RadioGroupProps } from './Types'
const RadioGroupContext = createContext({ name: '', value: '', disabled: false, onChange: (event) => {} })

export class RadioGroupItem extends Component<RadioGroupItemProps> {
    render() {
        return (
            <RadioGroupContext.Consumer>
                {(context) => {
                    return (
                        <>
                            <label className={(this.props.disabled || context.disabled) ? 'form__radio-item disabled' : 'form__radio-item'}>
                                <input
                                    type="radio"
                                    className="form__checkbox"
                                    name={context.name}
                                    disabled={context.disabled ?? this.props.disabled}
                                    onChange={context.onChange}
                                    value={this.props.value}
                                    checked={context.value === this.props.value}
                                    data-testid={this.props.dataTestId}
                                />
                                <span className="form__radio-item-content" data-testid={`${this.props.dataTestId}-span`}>
                                    <span className="radio__button"></span>
                                    <span className="radio__title">{this.props.children}</span>
                                </span>
                            </label>
                        </>
                    )
                }}
            </RadioGroupContext.Consumer>
        )
    }
}

export class RadioGroup extends Component<RadioGroupProps> {
    render() {
        return (
            <div className={`form__radio-group ${this.props.className || ''}`}>
                <RadioGroupContext.Provider
                    value={{
                        name: this.props.name,
                        value: this.props.value,
                        disabled: this.props.disabled,
                        onChange: this.props.onChange,
                    }}
                >
                    {this.props.children}
                </RadioGroupContext.Provider>
            </div>
        )
    }
}
