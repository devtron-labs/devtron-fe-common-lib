import ReactSelect from 'react-select'
import { useState } from 'react'
import { DEFAULT_TIME_OPTIONS, DropdownIndicatorTimePicker, getTimePickerStyles, updateTime } from './utils'
import { TimeSelectProps } from './types'
import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-warning.svg'

export const TimePickerSelect = ({
    disabled = false,
    date: dateObject = new Date(),
    onChange,
    timePickerProps,
    error,
    default12HourTime,
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
                    components={{
                        IndicatorSeparator: null,
                        ClearIndicator: null,
                        DropdownIndicator: DropdownIndicatorTimePicker,
                    }}
                    isSearchable={false}
                    styles={getTimePickerStyles()}
                    isDisabled={disabled}
                    {...timePickerProps}
                    value={selectedTimeOption}
                    onChange={handleTimeChange}
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
