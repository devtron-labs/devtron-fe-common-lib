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

import moment from 'moment'

export const selectedStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',

    hover: {
        background: 'var(--B500)',
        color: 'var(--N0)',
    },
}

export const selectedSpanStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',
    hover: {
        background: 'var(--B500)',
        color: 'var(--N0)',
    },
}

export const hoveredSpanStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',
}

export const customDayStyles = {
    selectedStartStyles: selectedStyles,
    selectedEndStyles: selectedStyles,
    hoveredSpanStyles,
    selectedSpanStyles,
    selectedStyles,
    border: 'none',
}

export const MONTHLY_DATES_CONFIG = {
    'Day 1': '1',
    'Day 2': '2',
    'Day 3': '3',
    'Day 4': '4',
    'Day 5': '5',
    'Day 6': '6',
    'Day 7': '7',
    'Day 8': '8',
    'Day 9': '9',
    'Day 10': '10',
    'Day 11': '11',
    'Day 12': '12',
    'Day 13': '13',
    'Day 14': '14',
    'Day 15': '15',
    'Day 16': '16',
    'Day 17': '17',
    'Day 18': '18',
    'Day 19': '19',
    'Day 20': '20',
    'Day 21': '21',
    'Day 22': '22',
    'Day 23': '23',
    'Day 24': '24',
    'Day 25': '25',
    'Day 26': '26',
    'Day 27': '27',
    'Day 28': '28',
    'Third Last Day': '-3',
    'Second Last Day': '-2',
    'Last Day': '-1',
}

export const TIME_OPTIONS_CONFIG = {
    '12:00 AM': '00:00:00',
    '12:30 AM': '00:30:00',
    '01:00 AM': '01:00:00',
    '01:30 AM': '01:30:00',
    '02:00 AM': '02:00:00',
    '02:30 AM': '02:30:00',
    '03:00 AM': '03:00:00',
    '03:30 AM': '03:30:00',
    '04:00 AM': '04:00:00',
    '04:30 AM': '04:30:00',
    '05:00 AM': '05:00:00',
    '05:30 AM': '05:30:00',
    '06:00 AM': '06:00:00',
    '06:30 AM': '06:30:00',
    '07:00 AM': '07:00:00',
    '07:30 AM': '07:30:00',
    '08:00 AM': '08:00:00',
    '08:30 AM': '08:30:00',
    '09:00 AM': '09:00:00',
    '09:30 AM': '09:30:00',
    '10:00 AM': '10:00:00',
    '10:30 AM': '10:30:00',
    '11:00 AM': '11:00:00',
    '11:30 AM': '11:30:00',
    '12:00 PM': '12:00:00',
    '12:30 PM': '12:30:00',
    '01:00 PM': '13:00:00',
    '01:30 PM': '13:30:00',
    '02:00 PM': '14:00:00',
    '02:30 PM': '14:30:00',
    '03:00 PM': '15:00:00',
    '03:30 PM': '15:30:00',
    '04:00 PM': '16:00:00',
    '04:30 PM': '16:30:00',
    '05:00 PM': '17:00:00',
    '05:30 PM': '17:30:00',
    '06:00 PM': '18:00:00',
    '06:30 PM': '18:30:00',
    '07:00 PM': '19:00:00',
    '07:30 PM': '19:30:00',
    '08:00 PM': '20:00:00',
    '08:30 PM': '20:30:00',
    '09:00 PM': '21:00:00',
    '09:30 PM': '21:30:00',
    '10:00 PM': '22:00:00',
    '10:30 PM': '22:30:00',
    '11:00 PM': '23:00:00',
    '11:30 PM': '23:30:00',
}

export const DATE_PICKER_PLACEHOLDER = {
    DATE: 'Select date',
    TIME: 'Select time',
    MONTH: 'Select month',
    DEFAULT_TIME: '12:00 AM',
    DEFAULT_MONTHLY_DATE: 'Day 1',
}

export const DATE_PICKER_IDS = {
    DATE: 'date_picker',
    MONTH: 'month_picker',
    TIME: 'time_picker',
}

export const styles = {
    PresetDateRangePickerPanel: {
        padding: '0px',
        width: '200px',
        height: '100%',
    },
    PresetDateRangePickerButton: {
        width: '188px',
        background: 'var(--transparent)',
        border: 'none',
        color: 'var(--N900)',
        padding: '8px',
        font: 'inherit',
        fontWeight: 500,
        lineHeight: 'normal',
        overflow: 'visible',
        cursor: 'pointer',
        ':active': {
            outline: 0,
        },
    },
    DayPickerHorizontal: {
        borderRadius: '4px',
    },
    PresetDateRangePickerButtonSelected: {
        color: 'var(--B500)',
        fontWeight: 600,
        background: 'var(--B100)',
        outline: 'none',
    },
}

export const DayPickerCalendarInfoHorizontal = {
    width: '532px',
    boxShadow: 'none',
}

export const DayPickerRangeControllerPresets = [
    { text: 'Last 5 minutes', endDate: moment(), startDate: moment().subtract(5, 'minutes'), endStr: 'now-5m' },
    { text: 'Last 30 minutes', endDate: moment(), startDate: moment().subtract(30, 'minutes'), endStr: 'now-30m' },
    { text: 'Last 1 hour', endDate: moment(), startDate: moment().subtract(1, 'hours'), endStr: 'now-1h' },
    { text: 'Last 24 hours', endDate: moment(), startDate: moment().subtract(24, 'hours'), endStr: 'now-24h' },
    { text: 'Last 7 days', endDate: moment(), startDate: moment().subtract(7, 'days'), endStr: 'now-7d' },
    { text: 'Last 1 month', endDate: moment(), startDate: moment().subtract(1, 'months'), endStr: 'now-1M' },
    { text: 'Last 6 months', endDate: moment(), startDate: moment().subtract(6, 'months'), endStr: 'now-6M' },
]

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

export function getCalendarValue(startDateStr: string, endDateStr: string): string {
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
