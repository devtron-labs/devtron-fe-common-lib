import { RadioGroupItemProps } from './Types'
import { RadioGroupContext } from './RadioGroup'

const RadioGroupItem = (props: RadioGroupItemProps) => {
    const { value, disabled, children, dataTestId } = props
    return (
        <RadioGroupContext.Consumer>
            {(context) => (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label className={disabled || context.disabled ? 'form__radio-item disabled' : 'form__radio-item'}>
                    <input
                        type="radio"
                        className="form__checkbox"
                        name={context.name}
                        disabled={context.disabled || disabled}
                        onChange={context.onChange}
                        value={value}
                        checked={context.value === value}
                        data-testid={dataTestId}
                    />
                    <span className="form__radio-item-content" data-testid={`${dataTestId}-span`}>
                        <span className="radio__button" />
                        <span className="radio__title">{children}</span>
                    </span>
                </label>
            )}
        </RadioGroupContext.Consumer>
    )
}
export default RadioGroupItem
