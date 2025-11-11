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

import { useState } from 'react'
import { DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates'
import CustomizableCalendarDay from 'react-dates/esm/components/CustomizableCalendarDay.js'
import moment, { Moment } from 'moment'

import 'react-dates/initialize'

import { Icon } from '../Icon'
import { customDayStyles, DayPickerCalendarInfoHorizontal, DayPickerRangeControllerPresets, styles } from './constants'
import { DatePickerRangeControllerProps } from './types'

import 'react-dates/lib/css/_datepicker.css'

export const DatePickerRangeController = ({
    handlePredefinedRange,
    handleApply,
    calendar,
    calendarInputs,
    handleDateInput,
    handleDatesChange,
    calendarValue,
    focusedInput,
    handleFocusChange,
}: DatePickerRangeControllerProps) => {
    const [showCalendar, setShowCalender] = useState(false)
    const onClickApplyTimeChange = () => {
        setShowCalender(false)
        handleApply()
    }

    const onClickPredefinedTimeRange = (startDate: Moment, endDate: Moment, endStr: string) => () => {
        handlePredefinedRange(startDate, endDate, endStr)
        setShowCalender(false)
    }

    const renderDatePresets = () => (
        <div
            className="flex left top"
            style={{
                ...styles.PresetDateRangePickerPanel,
                ...DayPickerCalendarInfoHorizontal,
                ...{
                    PresetDateRangePickerPanel: {
                        padding: '0px',
                        width: '200px',
                        height: '100%',
                    },
                    ...styles.DayPickerHorizontal,
                },
            }}
        >
            <div style={{ width: '312px', borderLeft: 'solid 1px var(--N200)', height: '304px', padding: '16px' }}>
                <p className="mb-16 fw-6">Pick time range</p>
                <div>
                    <div className="w-100 mb-16">
                        From
                        <input
                            type="text"
                            className="dc__block w-100 dc__border"
                            value={calendarInputs.startDate}
                            onChange={(event) => {
                                handleDateInput('startDate', event.target.value)
                            }}
                        />
                    </div>
                    <div className="w-100 mb-16">
                        To
                        <input
                            type="text"
                            className="dc__block w-100 dc__border"
                            value={calendarInputs.endDate}
                            onChange={(event) => {
                                handleDateInput('endDate', event.target.value)
                            }}
                        />
                    </div>
                    <button type="button" className="cta small" onClick={onClickApplyTimeChange}>
                        Apply Time Range
                    </button>
                </div>
            </div>
            <div style={{ width: '220px', padding: '16px', borderLeft: 'solid 1px var(--N200)', height: '304px' }}>
                {DayPickerRangeControllerPresets.map(({ text, startDate, endDate, endStr }) => {
                    const isSelected =
                        startDate.isSame(calendar.startDate, 'minute') &&
                        startDate.isSame(calendar.startDate, 'hour') &&
                        startDate.isSame(calendar.startDate, 'day') &&
                        endDate.isSame(calendar.endDate, 'day')
                    let buttonStyles = {
                        ...styles.PresetDateRangePickerButton,
                    }
                    if (isSelected) {
                        buttonStyles = {
                            ...buttonStyles,
                            ...styles.PresetDateRangePickerButtonSelected,
                        }
                    }
                    return (
                        <button
                            type="button"
                            key={text}
                            style={{ ...buttonStyles, textAlign: 'left' }}
                            onClick={onClickPredefinedTimeRange(startDate, endDate, endStr)}
                        >
                            {text}
                        </button>
                    )
                })}
            </div>
        </div>
    )

    return (
        <>
            <div
                data-testid="app-metrics-range-picker-box"
                className="flex h-36"
                style={{ borderRadius: '4px', border: 'solid 1px var(--N200)' }}
                onClick={() => {
                    setShowCalender(!showCalendar)
                }}
            >
                <p className="cursor" style={{ marginBottom: '0', height: '32px', padding: '5px' }}>
                    {calendarValue}
                </p>
                <Icon name="ic-caret-down-small" color="N600" />
            </div>
            {showCalendar && (
                <DayPickerRangeController
                    startDate={calendar.startDate}
                    endDate={calendar.endDate}
                    focusedInput={focusedInput}
                    onDatesChange={handleDatesChange}
                    onFocusChange={handleFocusChange}
                    numberOfMonths={1}
                    withPortal
                    renderCalendarInfo={renderDatePresets}
                    calendarInfoPosition="after"
                    hideKeyboardShortcutsPanel
                    isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())} // enable past dates
                    renderCalendarDay={(props) => <CustomizableCalendarDay {...props} {...customDayStyles} />}
                    onOutsideClick={() => {
                        setShowCalender(false)
                    }}
                    initialVisibleMonth={() => moment().subtract(2, 'd')} //
                />
            )}
        </>
    )
}
