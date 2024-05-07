import moment from 'moment'
import ReactSelect from 'react-select'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import CustomizableCalendarDay from 'react-dates/lib/components/CustomizableCalendarDay'
import { useEffect, useState } from 'react'
import { getCommonSelectStyle, SelectOption } from '../ReactSelect'
import { DateTimePickerProps } from './types'
import { customDayStyles } from './constants'
import { ReactComponent as ICCalendar } from '../../../Assets/Icon/ic-calendar.svg'
import { ReactComponent as ICClock } from '../../../Assets/Icon/ic-clock.svg'
import { getIsDateOutsideRange } from './utils'

const DropdownIndicator = () => <ICClock className="icon-dim-16 ml-8" />

const DateTimePicker = ({
    showDate,
    showTime,
    label,
    showTimeZone,
    isRequired,
    datePlaceholder,
    timePlaceholder,
    date = moment(),
    time,
    handleDateChange,
    dateFormat,
    dateId,
    timeOptionsDifference = 30,
    handleTimeChange,
}: DateTimePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<DateTimePickerProps['date']>(null)
    const [selectedTime, setSelectedTime] = useState<DateTimePickerProps['time']>(null)
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        setSelectedDate(date)
    }, [date])

    const getTimeSelectOptions = () => {
        const ALLOW_UNTIL_TIME = {} as Record<string, string>

        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += timeOptionsDifference) {
                const hour = i < 10 ? `0${i}` : i
                const minute = j < 10 ? `0${j}` : j
                const selectTime = `${hour}:${minute}:00`
                const selectLabel = `${hour}:${minute} ${i < 12 ? 'AM' : 'PM'}`
                ALLOW_UNTIL_TIME[selectLabel] = selectTime
            }

            // if (i === 11) {
            //     break
            // }
            // const halfHour = i * 60 + 30
            // const hour = Math.floor(halfHour / 60)
            // const minute = halfHour % 60
            // const selectTime = `${hour}:${minute}:00`
            // const selectLabel = `${hour}:${minute} ${i < 12 ? 'AM' : 'PM'}`
            // ALLOW_UNTIL_TIME[selectLabel] = selectTime
        }

        const ALLOW_UNTIL_TIME_OPTIONS = Object.entries(ALLOW_UNTIL_TIME).map(([key, value]) => ({
            label: key,
            value,
        }))

        return ALLOW_UNTIL_TIME_OPTIONS
    }

    useEffect(() => {
        // TODO: Parsing it to nearest next time option
        setSelectedTime(time)
    }, [time])

    const handleFocusChange = ({ focused: isFocused }) => {
        setFocused(isFocused)
    }

    const handleLocalDateChange = (changedDate) => {
        if (handleDateChange) {
            handleDateChange(changedDate)
            return
        }

        setSelectedDate(changedDate)
    }

    const handleLocalTimeChange = (changedTimeOption: DateTimePickerProps['time']) => {
        if (handleTimeChange) {
            handleTimeChange(changedTimeOption)
            return
        }

        setSelectedTime(changedTimeOption)
    }

    const offset = moment(new Date()).format('Z')
    const timeZone = `${Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? ''} (GMT ${offset})`

    if (!showDate && !showTime) {
        return null
    }

    return (
        <div className="flexbox-col dc__gap-6">
            {label && (
                <span className={`cn-7 fs-13 fw-4 lh-20 ${isRequired ? 'dc__required-field' : ''}`}>{label}</span>
            )}

            <div className="flexbox dc__gap-8 dc__align-items-center">
                {showDate && (
                    <SingleDatePicker
                        id={dateId}
                        focused={focused}
                        onFocusChange={handleFocusChange}
                        placeholder={datePlaceholder}
                        date={selectedDate}
                        onDateChange={handleLocalDateChange}
                        numberOfMonths={1}
                        openDirection="down"
                        renderCalendarDay={(props) => <CustomizableCalendarDay {...props} {...customDayStyles} />}
                        hideKeyboardShortcutsPanel
                        withFullScreenPortal={false}
                        orientation="horizontal"
                        customInputIcon={<ICCalendar className="icon-dim-16 dc__no-shrink" />}
                        isOutsideRange={getIsDateOutsideRange}
                        displayFormat={dateFormat}
                    />
                )}

                {showTime && (
                    <ReactSelect
                        placeholder={timePlaceholder}
                        options={getTimeSelectOptions()}
                        value={selectedTime}
                        onChange={handleLocalTimeChange}
                        menuPlacement="bottom"
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                            DropdownIndicator,
                            Option: SelectOption,
                        }}
                        styles={getCommonSelectStyle()}
                        isOptionDisabled={(option) => option.isDisabled}
                    />
                )}
            </div>

            {showTimeZone && <span className="flexbox fs-11 fw-4 lh-16 cn-7">{timeZone}</span>}
        </div>
    )
}

export default DateTimePicker
