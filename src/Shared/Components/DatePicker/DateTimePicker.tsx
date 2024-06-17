/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { SingleDatePicker } from 'react-dates'
import ReactSelect, { SelectInstance } from 'react-select'
import moment from 'moment'
import CustomizableCalendarDay from 'react-dates/esm/components/CustomizableCalendarDay.js'
import { useState } from 'react'
import {
    DEFAULT_TIME_OPTIONS,
    DropdownIndicatorTimePicker,
    getTimePickerStyles,
    getTimeValue,
    updateDate,
    updateTime,
} from './utils'
import { DateTimePickerProps } from './types'
import { customDayStyles } from './constants'
import './datePicker.scss'
import { ReactComponent as CalendarIcon } from '../../../Assets/Icon/ic-calendar.svg'

const timePickerStyles = getTimePickerStyles()

const DateTimePicker = ({
    date: dateObject = new Date(),
    onChange,
    timePickerProps = {} as SelectInstance,
    disabled,
    id,
    label,
    required,
    hideTimeSelect = false,
    readOnly = false,
}: DateTimePickerProps) => {
    // const value = dayjs(dateObject)
    const time = getTimeValue(dateObject)
    const selectedTimeOption = DEFAULT_TIME_OPTIONS.find((option) => option.value === time) ?? DEFAULT_TIME_OPTIONS[0]
    const [focused, setFocused] = useState(false)

    const handleFocusChange = ({ focused }) => {
        setFocused(focused)
    }
    const handleDateChange = (event) => {
        onChange(updateDate(dateObject, event.toDate()))
    }

    const handleTimeChange = (option) => {
        onChange(updateTime(dateObject, option.value))
    }

    return (
        <div>
            <label className={`form__label ${required ? 'dc__required-field' : ''}`} htmlFor={id}>
                {label}
            </label>
            <div className="dc__grid-row-one-half dc__gap-8">
                <SingleDatePicker
                    id="single_date_picker"
                    placeholder="Select date"
                    date={moment(dateObject)}
                    onDateChange={handleDateChange}
                    focused={focused}
                    onFocusChange={handleFocusChange}
                    numberOfMonths={1}
                    openDirection="down"
                    renderCalendarDay={(props) => <CustomizableCalendarDay {...props} {...customDayStyles} />}
                    hideKeyboardShortcutsPanel
                    withFullScreenPortal={false}
                    orientation="horizontal"
                    readOnly={readOnly || false}
                    customInputIcon={<CalendarIcon className="icon-dim-16" />}
                />
                {!hideTimeSelect && (
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
                            styles={timePickerStyles}
                            isDisabled={disabled}
                            {...timePickerProps}
                            value={selectedTimeOption}
                            onChange={handleTimeChange}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DateTimePicker
