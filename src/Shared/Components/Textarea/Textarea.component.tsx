import { useEffect, useRef } from 'react'
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

const { MIN_HEIGHT, MAX_HEIGHT } = TEXTAREA_CONSTRAINTS

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
    ...props
}: TextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const updateRefsHeight = (height: number) => {
        const refElement = textareaRef?.current
        if (refElement) {
            refElement.style.height = `${height}px`
        }
    }

    const reInitHeight = () => {
        let nextHeight = textareaRef?.current?.scrollHeight || 0

        if (nextHeight < parseInt(textareaRef?.current?.style.height, 10)) {
            return
        }

        if (nextHeight < MIN_HEIGHT) {
            nextHeight = MIN_HEIGHT
        }

        if (nextHeight > MAX_HEIGHT) {
            nextHeight = MAX_HEIGHT
        }

        updateRefsHeight(nextHeight)
    }

    useEffect(() => {
        reInitHeight()
    }, [])

    useThrottledEffect(reInitHeight, 300, [props.value])

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
            ariaLabel={ariaLabel}
        >
            <textarea
                {...props}
                {...getFormFieldAriaAttributes({
                    inputId: name,
                    required,
                    label,
                    ariaLabel,
                    error,
                })}
                autoComplete="off"
                name={name}
                id={name}
                spellCheck={false}
                data-testid={name}
                required={required}
                onBlur={handleBlur}
                className={`${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[size]} ${COMPONENT_SIZE_TYPE_TO_INLINE_PADDING_MAP[size]} w-100 dc__overflow-auto textarea`}
                ref={textareaRef}
                style={{
                    maxHeight: MAX_HEIGHT,
                    minHeight: MIN_HEIGHT,
                }}
            />
        </FormFieldWrapper>
    )
}

export default Textarea
