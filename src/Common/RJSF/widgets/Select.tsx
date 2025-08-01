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

import { WidgetProps } from '@rjsf/utils'
import { PLACEHOLDERS, RJSF_FORM_SELECT_PORTAL_TARGET_ID } from '../constants'

import { deepEqual } from '@Common/Helper'
import { SelectPicker } from '@Shared/Components'

export const SelectWidget = (props: WidgetProps) => {
    const {
        id,
        multiple = false,
        options,
        value,
        disabled,
        readonly,
        autofocus = false,
        onChange,
        onBlur,
        onFocus,
        placeholder,
        schema,
    } = props
    const { enumOptions: selectOptions = [] } = options
    const emptyValue = multiple ? [] : null

    const handleChange = (option) => {
        onChange(multiple ? option.map((o) => o.value) : option.value)
    }

    const getOption = (value) =>
        multiple
            ? selectOptions.filter((option) => value.some((val) => deepEqual(val, option.value)))
            : selectOptions.find((option) => deepEqual(value, option.value))

    return (
        <SelectPicker
            inputId={`devtron-rjsf-select__${id}`}
            name={id}
            isMulti={multiple}
            value={typeof value === 'undefined' ? emptyValue : getOption(value)}
            autoFocus={autofocus}
            onChange={handleChange}
            options={selectOptions}
            onBlur={() => onBlur(id, value)}
            onFocus={() => onFocus(id, value)}
            placeholder={schema.placeholder || placeholder || PLACEHOLDERS.SELECT}
            isDisabled={disabled || readonly}
            menuPortalTarget={document.getElementById(RJSF_FORM_SELECT_PORTAL_TARGET_ID)}
            menuPosition='fixed'
        />
    )
}
