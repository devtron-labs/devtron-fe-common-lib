import { TextareaHTMLAttributes, useEffect, useRef, useState } from 'react'
import {
    COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP,
    COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP,
    ComponentSizeType,
} from '@Shared/constants'
import { useThrottledEffect } from '@Common/Helper'
import { FormFieldWrapper, getFormFieldAriaAttributes } from '../FormFieldWrapper'
import { TextareaProps } from './types'
import { TEXTAREA_CONSTRAINTS } from './constants'
import './textarea.scss'
import { getFormFieldBorderClassName } from '../FormFieldWrapper/utils'

const { MIN_HEIGHT, AUTO_EXPANSION_MAX_HEIGHT } = TEXTAREA_CONSTRAINTS

const Textarea = ({
    name,
    label,
    fullWidth,
    error,
    helperText,
    warningText,
    layout,
    required,
    onBlur,
    shouldTrim = true,
    size = ComponentSizeType.large,
    ariaLabel,
    borderRadiusConfig,
    labelTooltipConfig,
    labelTippyCustomizedConfig,
    value,
    ...props
}: TextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    // If the passed value remains the same, the component will behave as un-controlled
    // else, it behaves as controlled
    const [text, setText] = useState('')

    const updateRefsHeight = (height: number) => {
        const refElement = textareaRef.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
    }

    const reInitHeight = () => {
        const currentHeight = parseInt(textareaRef.current.style.height, 10)
        let nextHeight = textareaRef.current.scrollHeight || 0

        if (nextHeight < currentHeight || currentHeight > AUTO_EXPANSION_MAX_HEIGHT) {
            return
        }

        if (nextHeight < MIN_HEIGHT) {
            nextHeight = MIN_HEIGHT
        }

        if (nextHeight > AUTO_EXPANSION_MAX_HEIGHT) {
            nextHeight = AUTO_EXPANSION_MAX_HEIGHT
        }

        updateRefsHeight(nextHeight)
    }

    useEffect(() => {
        setText(value)
    }, [value])

    useThrottledEffect(reInitHeight, 300, [text])

    const handleChange: TextareaProps['onChange'] = (e) => {
        setText(e.target.value)

        props.onChange?.(e)
    }

    const handleBlur: TextareaProps['onBlur'] = (event) => {
        // NOTE: This is to prevent the input from being trimmed when the user do not want to trim the input
        if (shouldTrim) {
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

    const handleKeyDown: TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation()
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
            ariaLabel={ariaLabel}
            borderRadiusConfig={borderRadiusConfig}
            labelTooltipConfig={labelTooltipConfig}
            labelTippyCustomizedConfig={labelTippyCustomizedConfig}
        >
            <textarea
                {...props}
                {...getFormFieldAriaAttributes({
                    inputId: name,
                    required,
                    label,
                    ariaLabel,
                    error,
                    helperText,
                })}
                autoComplete="off"
                name={name}
                id={name}
                spellCheck={false}
                data-testid={name}
                required={required}
                value={text}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[size]} ${COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP[size]} ${getFormFieldBorderClassName(borderRadiusConfig)} w-100 dc__overflow-auto textarea`}
                ref={textareaRef}
                style={{
                    // No max height when user is expanding
                    maxHeight: 'none',
                    minHeight: MIN_HEIGHT,
                }}
            />
        </FormFieldWrapper>
    )
}

export default Textarea
