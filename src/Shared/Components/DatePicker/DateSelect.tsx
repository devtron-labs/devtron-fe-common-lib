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
import { DateSelectProps } from './types'
import { MONTHLY_DATE_OPTIONS, getTimePickerStyles } from './utils'
import { DropdownIndicator } from '../../../Common'

export const DateSelect = ({ selectedDate, handleOnChange }: DateSelectProps) => (
    <div className="dc__no-shrink">
        <ReactSelect
            placeholder="12:00 AM"
            options={MONTHLY_DATE_OPTIONS}
            menuPlacement="auto"
            components={{
                IndicatorSeparator: null,
                ClearIndicator: null,
                DropdownIndicator,
            }}
            isSearchable={false}
            styles={getTimePickerStyles()}
            value={selectedDate}
            onChange={handleOnChange}
        />
    </div>
)
