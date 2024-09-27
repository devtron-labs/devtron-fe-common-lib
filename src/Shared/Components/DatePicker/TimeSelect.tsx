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

import { ReactComponent as ErrorIcon } from '@Icons/ic-warning.svg'
import { ReactComponent as ClockIcon } from '@Icons/ic-clock.svg'
import { DEFAULT_TIME_OPTIONS } from './utils'
import { TimeSelectProps } from './types'
import { DATE_PICKER_IDS } from './constants'
import { SelectPicker } from '../SelectPicker'

export const TimePickerSelect = ({
    disabled = false,
    onChange,
    timePickerProps,
    error,
    selectedTimeOption,
}: TimeSelectProps) => {
    const handleTimeSelectChange = (selectedOption) => {
        onChange(selectedOption)
    }
    return (
        <>
            <div className="dc__no-shrink">
                <SelectPicker
                    inputId={DATE_PICKER_IDS.TIME}
                    placeholder="12:00 AM"
                    options={DEFAULT_TIME_OPTIONS}
                    menuPosition="fixed"
                    isSearchable={false}
                    isDisabled={disabled}
                    {...timePickerProps}
                    value={selectedTimeOption}
                    icon={<ClockIcon className="icon-dim-20 fcn-6" />}
                    onChange={handleTimeSelectChange}
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
