import ReactSelect from 'react-select'
import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-warning.svg'
import { TimeSelectProps } from './types'
import { DEFAULT_TIME_OPTIONS, getTimePickerStyles, getTimeValue, updateTime } from './utils'
import { DropdownIndicatorTimePicker } from '../ReactSelect/utils'

export const TimePickerSelect = ({
    disabled = false,
    date: dateObject = new Date(),
    onChange,
    timePickerProps,
    error,
}: TimeSelectProps) => {
    const time = getTimeValue(dateObject)
    const selectedTimeOption = DEFAULT_TIME_OPTIONS.find((option) => option.value === time) ?? DEFAULT_TIME_OPTIONS[0]

    const handleTimeChange = (option) => {
        onChange(updateTime(dateObject, option.value))
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
