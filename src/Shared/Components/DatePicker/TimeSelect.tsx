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

import ReactSelect from 'react-select'
import { DEFAULT_TIME_OPTIONS, DropdownIndicatorTimePicker, getTimePickerStyles } from './utils'
import { TimeSelectProps } from './types'
import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-warning.svg'
import { DATE_PICKER_IDS } from './constants'

export const TimePickerSelect = ({
    disabled = false,
    onChange,
    timePickerProps,
    error,
    selectedTimeOption,
}: TimeSelectProps) => {
    const timeSelectStyles = getTimePickerStyles()

    return (
        <>
            <div className="dc__no-shrink">
                <ReactSelect
                    placeholder="12:00 AM"
                    options={DEFAULT_TIME_OPTIONS}
                    menuPlacement="auto"
                    menuPosition="fixed"
                    components={{
                        IndicatorSeparator: null,
                        ClearIndicator: null,
                        DropdownIndicator: DropdownIndicatorTimePicker,
                    }}
                    isSearchable={false}
                    styles={timeSelectStyles}
                    isDisabled={disabled}
                    {...timePickerProps}
                    value={selectedTimeOption}
                    onChange={onChange}
                    data-testid={DATE_PICKER_IDS.TIME}
                />
            </div>
            {error && (
                <div className="form__error">
                    <ErrorIcon className="form__icon form__icon--error" />
                    {error}
                </div>
            )}
        </>
    )
}
