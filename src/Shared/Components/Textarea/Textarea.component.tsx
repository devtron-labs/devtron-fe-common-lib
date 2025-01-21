import {
    COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP,
    COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP,
    ComponentSizeType,
} from '@Shared/constants'
import { FormFieldWrapper } from '../FormFieldWrapper'
import { TextareaProps } from './types'

const Textarea = ({
    error,
    fullWidth,
    helperText,
    label,
    layout,
    required,
    warningText,
    name,
    dataTestId,
    shouldTrim,
    onBlur,
    size = ComponentSizeType.large,
    ...props
}: TextareaProps) => {
    const handleBlur: TextareaProps['onBlur'] = (event) => {
        // NOTE: This is to prevent the input from being trimmed when the user do not want to trim the input
        if (!shouldTrim) {
            const trimmedValue = event.target.value?.trim()

            if (event.target.value !== trimmedValue) {
                event.stopPropagation()
                // eslint-disable-next-line no-param-reassign
                event.target.value = trimmedValue
                props.onChange(event)
            }
        }
        if (typeof onBlur === 'function') {
            onBlur(event)
        }
    }

    return (
        <FormFieldWrapper
            inputId={name}
            layout={layout}
            label={label}
            error={error}
            helperText={helperText}
            warningText={warningText}
            required={required}
            fullWidth={fullWidth}
        >
            <textarea
                {...props}
                autoComplete="off"
                name={name}
                id={name}
                spellCheck={false}
                data-testid={dataTestId}
                required={required}
                onBlur={handleBlur}
                className={`${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[size]} ${COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP[size]} br-4 fw-4 w-100`}
                aria-invalid={!!error}
                aria-disabled={!!props.disabled}
            />
        </FormFieldWrapper>
    )
}

export default Textarea
