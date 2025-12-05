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

import { prefixZeroIfSingleDigit } from '@Common/Helper'

import { SelectPickerOptionType } from '../SelectPicker'
import { DayPickerRangeControllerPresets, MONTHLY_DATES_CONFIG, TIME_OPTIONS_CONFIG } from './constants'

/**
 * Return the options for the dates in label and value format
 */
export const MONTHLY_DATE_OPTIONS = Object.entries(MONTHLY_DATES_CONFIG).map(([label, value]) => ({
    label,
    value,
}))

/**
 * Return the options for the time in label and value format
 * @type {SelectPickerOptionType[]}
 */
// eslint-disable-next-line import/prefer-default-export
export const DEFAULT_TIME_OPTIONS: SelectPickerOptionType[] = Object.entries(TIME_OPTIONS_CONFIG).map(
    ([label, value]) => ({
        label,
        value,
    }),
)

const formatTimePart = (value: number) => (value < 10 ? `0${value}` : value)
/**
 * Get the time value from the date object in the format: `hh:mm:ss`
 */
export const getTimeValue = (currentDateObj: Date) => {
    const [hours, minutes, seconds] = [
        currentDateObj.getHours(),
        currentDateObj.getMinutes(),
        currentDateObj.getSeconds(),
    ].map(formatTimePart)

    return `${hours}:${minutes}:${seconds}`
}

/**
 * Updates the time in the given date object and returns the updated object
 */
export const updateTime = (currentDateObj: Date, timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map((t) => parseInt(t, 10))
    const updatedDate = new Date(currentDateObj)
    updatedDate.setHours(hours, minutes, seconds)

    return { label: updatedDate, value: updatedDate }
}

/**
 * Updates the date in the given date object and returns the updated object
 */
export const updateDate = (currentDateObj: Date, newDate: Date) => {
    // In case of null date, it will return the same date
    if (!newDate) {
        return currentDateObj
    }
    const day = newDate.getDate()
    const month = newDate.getMonth()
    const fullYear = newDate.getFullYear()

    const updatedDate = new Date(currentDateObj)
    updatedDate.setFullYear(fullYear, month, day)

    return updatedDate
}

/**
 * Get the default date from the time to live
 * @param timeToLive
 * @returns
 */

export const getDefaultDateFromTimeToLive = (timeToLive: string, isTomorrow?: boolean) => {
    const date = timeToLive ? new Date(timeToLive) : new Date()

    let hours = date.getHours()
    let minutes = date.getMinutes()

    if (minutes === 0 || minutes === 30) {
        // If minutes is already 0 or 30, leave it unchanged
    } else if (minutes < 30) {
        minutes = 30
    } else {
        minutes = 0
        hours += 1
    }

    // Handle date change
    if (isTomorrow) {
        // Get tomorrow's date
        const tomorrowDate = new Date(date)
        tomorrowDate.setHours(hours, minutes, 0)
        tomorrowDate.setDate(date.getDate() + 1)
        return tomorrowDate
    }
    const nextDate = new Date(date)
    nextDate.setHours(hours, minutes, 0)
    return nextDate
}

/**
 * Returns a string representing the range of dates
 * given by the start and end dates. If the end date
 * is 'now' and the start date includes 'now',
 * it will return the corresponding range from the
 * DayPickerRangeControllerPresets array.
 * @param startDateStr - the start date string
 * @param endDateStr - the end date string
 * @returns - a string representing the range of dates
 */

export const getCalendarValue = (startDateStr: string, endDateStr: string): string => {
    let str: string = `${startDateStr} - ${endDateStr}`
    if (endDateStr === 'now' && startDateStr.includes('now')) {
        const range = DayPickerRangeControllerPresets.find((d) => d.endStr === startDateStr)
        if (range) {
            str = range.text
        } else {
            str = `${startDateStr} - ${endDateStr}`
        }
    }
    return str
}

// Need to send either the relative time like: now-5m or the timestamp to grafana
// Assuming format is 'DD-MM-YYYY hh:mm:ss'
export const getTimestampFromDateIfAvailable = (dateString: string): string => {
    try {
        const [day, month, yearAndTime] = dateString.split('-')
        const [year, time] = yearAndTime.split(' ')
        const updatedTime = time
            .split(':')
            .map((item) => (['0', '00'].includes(item) ? '00' : prefixZeroIfSingleDigit(Number(item))))
            .join(':')
        const formattedDate = `${year}-${prefixZeroIfSingleDigit(Number(month))}-${prefixZeroIfSingleDigit(Number(day))}T${updatedTime}`
        const parsedDate = new Date(formattedDate).getTime()

        return Number.isNaN(parsedDate) ? dateString : parsedDate.toString()
    } catch {
        return dateString
    }
}
