import { useState, useEffect, useRef } from 'react'
import * as React from 'react'
import { useThrottledEffect } from './Helper'
import { ResizableTextareaProps } from './Types'

export const ResizableTextarea: React.FC<ResizableTextareaProps> = ({
    minHeight,
    maxHeight,
    value,
    onChange = null,
    onBlur = null,
    onFocus = null,
    className = '',
    placeholder = 'Enter your text here..',
    lineHeight = 14,
    padding = 12,
    disabled = false,
    dataTestId,
    ...props
}) => {
    const [text, setText] = useState('')
    const _textRef = useRef(null)

    useEffect(() => {
        setText(value)
    }, [value])

    function handleChange(e) {
        e.persist()
        setText(e.target.value)
        if (typeof onChange === 'function') onChange(e)
    }

    function handleBlur(e) {
        if (typeof onBlur === 'function') onBlur(e)
    }

    function handleFocus(e) {
        if (typeof onFocus === 'function') onFocus(e)
    }

    useThrottledEffect(
        () => {
            _textRef.current.style.height = 'auto'
            let nextHeight = _textRef.current.scrollHeight
            if (minHeight && nextHeight < minHeight) {
                nextHeight = minHeight
            }
            if (maxHeight && nextHeight > maxHeight) {
                nextHeight = maxHeight
            }
            _textRef.current.style.height = `${nextHeight + 2}px`
        },
        500,
        [text],
    )

    return (
        <textarea
            data-testid={dataTestId}
            ref={(el) => (_textRef.current = el)}
            value={text}
            placeholder={placeholder}
            className={`dc__resizable-textarea ${className}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={{ lineHeight: `${lineHeight}px`, padding: `${padding}px` }}
            spellCheck={false}
            disabled={disabled}
            {...props}
        />
    )
}
