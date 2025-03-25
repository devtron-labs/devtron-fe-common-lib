import { useMemo, useRef, useState } from 'react'
import { Props as ReactSelectProps, SelectInstance } from 'react-select'
import { SelectPickerHooksProps } from './type'
import { getCommonSelectStyle } from './utils'

export const useSelectHooks = <OptionValue, IsMulti extends boolean>({
    error,
    size,
    menuSize,
    variant,
    multiSelectProps,
    shouldMenuAlignRight,
    onKeyDown,
    onBlur,
}: SelectPickerHooksProps<OptionValue, IsMulti>) => {
    const selectRef = useRef<SelectInstance>(null)
    const [isFocussed, setIsFocussed] = useState(false)
    const { getIsOptionValid, isGroupHeadingSelectable } = multiSelectProps

    const handleKeyDown: ReactSelectProps['onKeyDown'] = (e) => {
        // Prevent the option from being selected if meta or control key is pressed
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
        }
        if (e.key === 'Escape') {
            selectRef.current?.inputRef.blur()
        }
        onKeyDown?.(e)
    }

    const handleFocus: ReactSelectProps['onFocus'] = () => {
        setIsFocussed(true)
    }

    const handleBlur: ReactSelectProps['onFocus'] = (e) => {
        setIsFocussed(false)
        onBlur?.(e)
    }

    const styles = useMemo(
        () =>
            getCommonSelectStyle({
                error,
                size,
                menuSize,
                variant,
                getIsOptionValid,
                isGroupHeadingSelectable,
                shouldMenuAlignRight,
            }),
        [error, size, menuSize, variant, getIsOptionValid, isGroupHeadingSelectable, shouldMenuAlignRight],
    )

    return { selectRef, styles, isFocussed, handleKeyDown, handleFocus, handleBlur }
}
