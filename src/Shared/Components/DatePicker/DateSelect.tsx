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
