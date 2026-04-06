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

import { useMemo, useRef } from 'react'
import { DateRange, DayPicker, OnSelectHandler } from 'react-day-picker'
import { SelectInstance } from 'react-select'
import dayjs from 'dayjs'

import { ReactComponent as ClockIcon } from '@Icons/ic-clock.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { DATE_TIME_FORMATS } from '@Common/Constants'
import { ComponentSizeType } from '@Shared/constants'
import { getUniqueId } from '@Shared/Helpers'

import { Icon } from '../Icon'
import { Popover, usePopover } from '../Popover'
import { SelectPicker, SelectPickerOptionType } from '../SelectPicker'
import { DATE_PICKER_CUSTOM_COMPONENTS, DATE_PICKER_IDS, DATE_PICKER_PLACEHOLDER } from './constants'
import { DateTimePickerProps, UpdateDateRangeType } from './types'
import { DEFAULT_TIME_OPTIONS, getTimeValue, updateDate, updateTime } from './utils'

import 'react-day-picker/style.css'
import './DateTimePicker.scss'

const isDateUpdateRange = (
    isRange: boolean,
    handler: DateTimePickerProps['onChange'],
): handler is UpdateDateRangeType => isRange

const getTodayDate = (): Date => {
    const today = dayjs()
    return today.toDate()
}

const DateTimePicker = ({
    date: dateObject = getTodayDate(),
    dateRange = {
        from: getTodayDate(),
        to: getTodayDate(),
    },
    onChange,
    timePickerProps = {} as SelectInstance,
    disabled,
    id,
    label,
    required,
    hideTimeSelect = false,
    readOnly = false,
    dataTestIdForTime = DATE_PICKER_IDS.TIME,
    error = '',
    isRangePicker = false,
    isTodayBlocked = false,
    blockPreviousDates = true,
    isOutsideRange,
    rangeShortcutOptions,
}: DateTimePickerProps) => {
    const calendarPopoverId = useRef<string>(getUniqueId())

    const { open, overlayProps, popoverProps, triggerProps, scrollableRef } = usePopover({
        id: `date-time-picker-popover-${calendarPopoverId.current}`,
        alignment: 'end',
        variant: 'overlay',
    })

    const parsedPopoverProps = useMemo<typeof popoverProps>(
        () => ({
            ...popoverProps,
            className: `${popoverProps.className} w-100 p-12 date-time-picker`,
            style: {
                ...popoverProps.style,
                maxWidth: 'none',
            },
        }),
        [popoverProps],
    )

    const parsedOverlayProps = useMemo<typeof overlayProps>(
        () => ({
            ...overlayProps,
            initialFocus: false,
        }),
        [overlayProps],
    )

    const time = getTimeValue(dateObject)
    const selectedTimeOption = DEFAULT_TIME_OPTIONS.find((option) => option.value === time) ?? DEFAULT_TIME_OPTIONS[0]
    const handleTimeChange = (option: SelectPickerOptionType<string>) => {
        if (isDateUpdateRange(isRangePicker, onChange)) {
            return
        }
        onChange(updateTime(dateObject, option.value).value)
    }

    const handleDateRangeChange = (range: DateRange) => {
        if (isDateUpdateRange(isRangePicker, onChange)) {
            const fromDate = range.from ? range.from : new Date()
            const toDate = range.to ? range.to : undefined

            onChange({
                from: fromDate,
                to: toDate,
            })
        }
    }

    const handleRangeSelect: OnSelectHandler<DateRange> = (range) => {
        handleDateRangeChange(range)
    }

    const getRangeUpdateHandler = (range: DateRange) => () => {
        handleDateRangeChange(range)
    }

    const handleSingleDateSelect: OnSelectHandler<Date> = (date) => {
        if (!isDateUpdateRange(isRangePicker, onChange)) {
            const updatedDate = date ? updateDate(dateObject, date) : null
            onChange(updatedDate)
        }
    }

    const getDisabledState = () => {
        if (readOnly) {
            return true
        }

        const today = getTodayDate()
        today.setHours(0, 0, 0, 0)

        const isOutsideRangeFn = isOutsideRange || (() => false)

        if (isTodayBlocked) {
            return (date: Date) => date <= today || isOutsideRangeFn(date)
        }

        if (blockPreviousDates) {
            return (date: Date) => date < today || isOutsideRangeFn(date)
        }

        return isOutsideRangeFn
    }

    const renderDatePicker = () => {
        if (isRangePicker) {
            return (
                <div className="flexbox">
                    {!!rangeShortcutOptions?.length && (
                        <div className="flexbox-col py-20 px-16 w-200">
                            {rangeShortcutOptions.map(({ label: optionLabel, value, onClick }) => (
                                <button
                                    type="button"
                                    key={optionLabel}
                                    className="bg__hover cn-9 dc__tab-focus dc__align-left dc__transparent p-8 br-4"
                                    onClick={onClick || getRangeUpdateHandler(value)}
                                >
                                    {optionLabel}
                                </button>
                            ))}
                        </div>
                    )}

                    <DayPicker
                        mode="range"
                        // TODO: (Abhishek) Check why navLayout prop is causing issues with date selection
                        // navLayout="around"
                        selected={{
                            from: dateRange.from,
                            to: dateRange.to,
                        }}
                        onSelect={handleRangeSelect}
                        disabled={getDisabledState()}
                        components={DATE_PICKER_CUSTOM_COMPONENTS}
                    />
                </div>
            )
        }

        return (
            <DayPicker
                mode="single"
                // TODO: (Abhishek) Check why navLayout prop is causing issues with date selection
                // navLayout="around"
                selected={dateObject}
                onSelect={handleSingleDateSelect}
                disabled={getDisabledState()}
                components={DATE_PICKER_CUSTOM_COMPONENTS}
            />
        )
    }

    const renderInputLabel = () => {
        if (isRangePicker) {
            const fromDate = dateRange.from ? dayjs(dateRange.from).format(DATE_TIME_FORMATS.DD_MMM_YYYY) : ''
            const toDate = dateRange.to ? dayjs(dateRange.to).format(DATE_TIME_FORMATS.DD_MMM_YYYY) : '...'

            return `${fromDate} - ${toDate}`
        }

        return dayjs(dateObject).format(DATE_TIME_FORMATS.DD_MMM_YYYY)
    }

    const triggerElement = (
        <SelectPicker
            inputId="date-picker-input"
            placeholder={DATE_PICKER_PLACEHOLDER.DATE}
            menuIsOpen={false}
            isSearchable={false}
            value={{
                label: renderInputLabel(),
                value: '',
                startIcon: <Icon name="ic-calendar" color={null} />,
            }}
            size={ComponentSizeType.large}
        />
    )

    return (
        <div className="date-time-picker">
            {label && (
                <label className={`form__label ${required ? 'dc__required-field' : ''}`} htmlFor={id}>
                    {label}
                </label>
            )}
            <div className="flex left dc__gap-8">
                <Popover
                    open={open}
                    overlayProps={parsedOverlayProps}
                    popoverProps={parsedPopoverProps}
                    triggerProps={triggerProps}
                    triggerElement={triggerElement}
                    buttonProps={null}
                >
                    <div ref={scrollableRef} className="p-4">
                        {renderDatePicker()}
                    </div>
                </Popover>

                {!hideTimeSelect && (
                    <div className="dc__no-shrink">
                        <SelectPicker
                            inputId={DATE_PICKER_IDS.TIME}
                            placeholder={DATE_PICKER_PLACEHOLDER.DEFAULT_TIME}
                            options={DEFAULT_TIME_OPTIONS}
                            icon={<ClockIcon className="icon-dim-20 fcn-6" />}
                            isSearchable={false}
                            hideSelectedOptions
                            isDisabled={disabled}
                            {...timePickerProps}
                            value={selectedTimeOption}
                            onChange={handleTimeChange}
                            data-testid={dataTestIdForTime}
                            menuSize={ComponentSizeType.xs}
                            size={ComponentSizeType.large}
                            shouldMenuAlignRight
                        />
                    </div>
                )}
            </div>
            {error && (
                <div className="form__error">
                    <ICWarning className="form__icon form__icon--error" />
                    {error}
                </div>
            )}
        </div>
    )
}

export default DateTimePicker
