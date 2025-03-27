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

import { components, DropdownIndicatorProps, StylesConfig } from 'react-select'
import { ReactComponent as DropDownIcon } from '@Icons/ic-chevron-down.svg'
import { NO_MATCHING_RESULT, TYPE_3_CHARACTERS_TO_SEE_MATCHING_RESULTS } from '@Shared/constants'

export const CommonGroupedDropdownStyles: StylesConfig = {
    container: (base, state) => ({
        ...base,
        ...(state.isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
        }),
        minHeight: '36px',
        width: '100%',
    }),
    control: (base, state) => ({
        ...base,
        boxShadow: 'none',
        minHeight: '36px',
        backgroundColor: 'var(--bg-secondary)',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        opacity: state.isDisabled ? 0.5 : 1,
    }),
    singleValue: (base) => ({
        ...base,
        fontWeight: 400,
        color: 'var(--N900)',
        fontSize: '13px',
    }),
    option: (base, state) => ({
        ...base,
        padding: '6px 8px 6px 0',
        backgroundColor: state.isFocused ? 'var(--N100)' : 'var(--bg-primary)',
        color: 'var(--N900)',
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '13px',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '4px 0px 4px 8px',
        display: 'flex',
        minHeight: '36px',
        gap: '6px',
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        ...(state.isDisabled ? { opacity: state.isDisabled ? 0.7 : 1 } : {}),
    }),
    group: (base) => ({
        ...base,
        paddingTop: '4px',
        paddingBottom: 0,
    }),
    groupHeading: (base) => ({
        ...base,
        fontWeight: 600,
        fontSize: '12px',
        color: 'var(--N900)',
        backgroundColor: 'var(--N100)',
        marginBottom: 0,
        padding: '4px 8px',
        textTransform: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    menuList: (base) => ({
        ...base,
        padding: 0,
        marginBottom: '4px',
    }),
    multiValue: (base) => ({
        ...base,
        border: `1px solid var(--N200)`,
        borderRadius: `4px`,
        background: 'var(--bg-primary)',
        height: '28px',
        margin: '0px',
        padding: '2px',
        fontSize: '13px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        padding: '0px',
        fontSize: '13px',
    }),
    placeholder: (base) => ({
        ...base,
        position: 'absolute',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: 'var(--bg-primary)',
    }),
}

export const APP_SELECTOR_STYLES: StylesConfig = {
    control: (base, state) => ({
        ...base,
        border: state.menuIsOpen ? '1px solid var(--B500)' : 'unset',
        boxShadow: 'none',
        color: 'var(--N900)',
        minHeight: '32px',
        minWidth: state.menuIsOpen ? '300px' : 'unset',
        justifyContent: state.menuIsOpen ? 'space-between' : 'flex-start',
        cursor: 'pointer',
        backgroundColor: 'var(--bg-primary)',
        maxWidth: '350px',
    }),
    valueContainer: (base, state) => ({
        ...base,
        display: 'flex',
        flexDirection: 'row-reverse',
        flexBasis: '0px',
        justifyContent: 'flex-end',
        padding: state.selectProps.menuIsOpen ? '0 0 0 4px' : '0',
        color: state.selectProps.menuIsOpen ? 'var(--N500)' : 'var(--N900)',
        height: '30px',
    }),
    singleValue: (base, state) => ({
        ...base,
        color: state.selectProps.menuIsOpen ? 'var(--N500)' : 'var(--N900)',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: 'var(--bg-primary)',
        minWidth: '300px',
        fontSize: '14px',
        fontWeight: 'normal',
    }),
    menuList: (base) => ({
        ...base,
        padding: '8px',
    }),
    option: (base, state) => ({
        ...base,
        borderRadius: '4px',
        color: state.isSelected ? 'var(--B500)' : 'var(--N900)',
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected ? 'var(--B100)' : state.isFocused ? 'var(--N100)' : 'var(--bg-primary)',
        fontWeight: state.isSelected ? 600 : 'normal',
        marginRight: '8px',
    }),
    input: (base) => ({
        ...base,
        margin: '0',
        flex: 'unset',
        color: 'var(--N900)',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: '0 4px 0 4px',
    }),
}

export const AppSelectorDropdownIndicator = (props: DropdownIndicatorProps) => {
    const { selectProps } = props

    return (
        <components.DropdownIndicator {...props}>
            <DropDownIcon
                className="rotate"
                style={{
                    ['--rotateBy' as any]: selectProps.menuIsOpen ? '180deg' : '0deg',
                    height: '24px',
                    width: '24px',
                }}
            />
        </components.DropdownIndicator>
    )
}

export const AppSelectorNoOptionsMessage = (
    inputObj: { inputValue: string },
    hideCharacterResultInfo?: boolean,
): string => {
    if (inputObj && (inputObj.inputValue === '' || inputObj.inputValue.length < 3) && !hideCharacterResultInfo) {
        return TYPE_3_CHARACTERS_TO_SEE_MATCHING_RESULTS
    }
    return NO_MATCHING_RESULT
}
