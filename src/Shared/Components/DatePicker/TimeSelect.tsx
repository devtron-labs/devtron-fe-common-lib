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
import { useState } from 'react'
import { DEFAULT_TIME_OPTIONS, DropdownIndicatorTimePicker, updateTime } from './utils'
import { TimeSelectProps } from './types'
import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-warning.svg'
import { DATE_PICKER_IDS, reactSelectStyles } from './constants'

export const TimePickerSelect = ({
    disabled = false,
    date: dateObject = new Date(),
    onChange,
    timePickerProps,
    error,
    default12HourTime,
    dataTestIdForTime = DATE_PICKER_IDS.TIME,
}: TimeSelectProps) => {
    const [selectedTimeOption, setSelectedTimeOption] = useState(default12HourTime)

    const handleTimeChange = (option) => {
        onChange(updateTime(dateObject, option.value))
        setSelectedTimeOption(option)
    }
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
                    styles={reactSelectStyles}
                    isDisabled={disabled}
                    {...timePickerProps}
                    value={selectedTimeOption}
                    onChange={handleTimeChange}
                    data-testid={dataTestIdForTime}
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
