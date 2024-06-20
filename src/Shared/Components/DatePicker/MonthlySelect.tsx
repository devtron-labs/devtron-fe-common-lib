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
import { MONTHLY_DATE_OPTIONS, getTimePickerStyles } from './utils'
import { DropdownIndicator } from '../../../Common'
import { MonthlySelectProps } from './types'
import { DATE_PICKER_IDS } from './constants'

const timePickerStyles = getTimePickerStyles()

export const MonthlySelect = ({
    selectedMonthlyDate,
    onChange,
    dataTestId = DATE_PICKER_IDS.MONTH,
}: MonthlySelectProps) => (
    <div className="dc__no-shrink">
        {console.log('MonthlySelect.tsx')}
        <ReactSelect
            placeholder="Day 1"
            options={MONTHLY_DATE_OPTIONS}
            menuPlacement="auto"
            components={{
                IndicatorSeparator: null,
                ClearIndicator: null,
                DropdownIndicator,
            }}
            isSearchable={false}
            styles={timePickerStyles}
            value={selectedMonthlyDate}
            onChange={onChange}
            data-testid={dataTestId}
            menuPosition="fixed"
        />
    </div>
)
