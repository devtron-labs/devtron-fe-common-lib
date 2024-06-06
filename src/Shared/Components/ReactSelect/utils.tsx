/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Tippy from '@tippyjs/react'
import { components } from 'react-select'
import { Progressing, stopPropagation } from '../../../Common'
import { ReactComponent as ICCaretDown } from '../../../Assets/Icon/ic-chevron-down.svg'
import { ReactComponent as ClockIcon } from '../../../Assets/Icon/ic-clock.svg'

export const getCommonSelectStyle = (styleOverrides = {}) => ({
    container: (base, state) => ({
        ...base,
        ...(state.isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
        }),
    }),
    menuList: (base) => ({
        ...base,
        padding: 0,
        paddingBlock: '4px',
        cursor: 'pointer',
    }),
    control: (base, state) => ({
        ...base,
        minHeight: '32px',
        boxShadow: 'none',
        backgroundColor: state.isDisabled ? 'var(--N100)' : 'var(--N50)',
        border: '1px solid var(--N200)',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',

        '&:hover': {
            borderColor: 'var(--N300)',
        },
        '&:focus, &:focus-within': {
            borderColor: 'var(--B500)',
            outline: 'none',
        },
    }),
    option: (base, state) => ({
        ...base,
        color: 'var(--N900)',
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected ? 'var(--B100)' : state.isFocused ? 'var(--N100)' : 'white',
        padding: '10px 12px',
        cursor: 'pointer',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,

        ':active': {
            backgroundColor: 'var(--N100)',
        },
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--N600)',
        padding: '0 8px',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
        fontWeight: '400',
    }),
    loadingMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'var(--N500)',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    ...styleOverrides,
})

const getCustomOptionBackgroundColor = (isSelected: boolean, isFocused: boolean) => {
    if (isSelected) {
        return 'var(--B100)'
    }

    if (isFocused) {
        return 'var(--N50)'
    }

    return 'var(--white)'
}

export const getCustomOptionSelectionStyle =
    (styleOverrides = {}) =>
    (base, state) => ({
        ...base,
        backgroundColor: getCustomOptionBackgroundColor(state.isSelected, state.isFocused),
        color: state.isSelected ? 'var(--B500)' : 'var(--N900)',
        textOverflow: 'ellipsis',
        fontWeight: '500',
        overflow: 'hidden',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        fontSize: '13px',
        ...styleOverrides,
    })

export const SelectOption = (props: any) => {
    const { selectProps, data, showTippy, style, placement, tippyContent, tippyClass } = props
    selectProps.styles.option = getCustomOptionSelectionStyle(style)
    const getOption = () => (
        <div onClick={stopPropagation}>
            <components.Option {...props} />
        </div>
    )

    return showTippy ? (
        <Tippy
            className={tippyClass || 'default-white'}
            arrow={false}
            placement={placement || 'right'}
            content={tippyContent || data.label}
        >
            {getOption()}
        </Tippy>
    ) : (
        getOption()
    )
}

export const LoadingIndicator = () => <Progressing />

export const GroupHeading = (props: any) => {
    const { data } = props
    if (!data.label) {
        return null
    }

    return (
        <components.GroupHeading {...props}>
            <div className="flex dc__no-text-transform flex-justify dc__truncate-text h-100">
                <span className="dc__truncate-text">{data.label}</span>
            </div>
        </components.GroupHeading>
    )
}

export const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <ICCaretDown className="icon-dim-20 icon-n6" data-testId />
    </components.DropdownIndicator>
)

export const commonSelectStyles = getCommonSelectStyle()

/**
 * Clock icon for the time picker
 */
export const DropdownIndicatorTimePicker = (props) => (
    <components.DropdownIndicator {...props}>
        <ClockIcon className="icon-dim-20 fcn-6" />
    </components.DropdownIndicator>
)
