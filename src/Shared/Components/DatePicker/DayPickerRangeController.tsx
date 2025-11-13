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
// eslint-disable-next-line import/extensions
import CustomizableCalendarDay from 'react-dates/esm/components/CustomizableCalendarDay.js'
import moment, { Moment } from 'moment'

import { ComponentSizeType } from '@Shared/constants'

import 'react-dates/initialize'

import { Button } from '../Button'
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
                ...styles.PresetDateRangePicker_panel,
                ...DayPickerCalendarInfoHorizontal,
                ...{
                    PresetDateRangePicker_panel: {
                        padding: '0px',
                        width: '200px',
                        height: '100%',
                    },
                    ...styles.DayPicker__horizontal,
                },
            }}
        >
            <div className="w-300 h-300 p-16">
                <p className="mb-16 fw-6">Pick time range</p>
                <div>
                    <div className="w-100 mb-16">
                        <span>From</span>
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
                        <span>To</span>
                        <input
                            type="text"
                            className="dc__block w-100 dc__border"
                            value={calendarInputs.endDate}
                            onChange={(event) => {
                                handleDateInput('endDate', event.target.value)
                            }}
                        />
                    </div>
                    <Button
                        text="Apply Time Range"
                        onClick={onClickApplyTimeChange}
                        dataTestId="apply-time-range"
                        size={ComponentSizeType.medium}
                    />
                </div>
            </div>
            <div className="w-200 p-16 h-300">
                {DayPickerRangeControllerPresets.map(({ text, startDate, endDate, endStr }) => {
                    const isSelected =
                        startDate.isSame(calendar.startDate, 'minute') &&
                        startDate.isSame(calendar.startDate, 'hour') &&
                        startDate.isSame(calendar.startDate, 'day') &&
                        endDate.isSame(calendar.endDate, 'day')
                    let buttonStyles = {
                        ...styles.PresetDateRangePicker_button,
                    }
                    if (isSelected) {
                        buttonStyles = {
                            ...buttonStyles,
                            ...styles.PresetDateRangePicker_button__selected,
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

    const toggleCalender = () => {
        setShowCalender(!showCalendar)
    }

    const hideCalender = () => setShowCalender(false)

    return (
        <>
            <div
                data-testid="app-metrics-range-picker-box"
                className="flex h-36"
                style={{ borderRadius: '4px', border: 'solid 1px var(--N200)' }}
                onClick={toggleCalender}
            >
                <p className="cursor mb-0 h-32 p-6">{calendarValue}</p>
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
                    onOutsideClick={hideCalender}
                    initialVisibleMonth={() => moment().subtract(2, 'd')} //
                />
            )}
        </>
    )
}
