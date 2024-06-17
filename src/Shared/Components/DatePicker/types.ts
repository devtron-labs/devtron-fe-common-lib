import { Moment } from 'moment'
import { SelectInstance } from 'react-select'
import { OptionType } from '../../../Common'

export interface SingleDatePickerProps {
    /**
     * Date value to be displayed
     */
    date: Moment
    /**
     * Function to handle date change
     */
    handleDatesChange: (e) => void
    /**
     * Value to make date picker read only
     */
    readOnly?: boolean
    /**
     * Value to block today's date
     */
    isTodayBlocked?: boolean
    /**
     * Value to block today's date
     */
    datePickerProps?: any
    /**
     * Display format for the date
     */
    displayFormat?: string
}

export interface DateSelectProps {
    /**
     * Current selected date object
     *
     * @default 'new Date()'
     */
    selectedDate: OptionType
    /**
     * Handler for updating the date from the parent component
     */
    handleOnChange: (date: OptionType) => void
}

export interface TimeSelectProps {
    /**
     * Current selected date object
     *
     * @default 'new Date()'
     */
    date?: Date
    /**
     * Handler for updating the date from the parent component
     */
    onChange: (date: Date) => void
    /**
     * Props for the time picker
     */
    timePickerProps?: SelectInstance
    /**
     * Error message for the DateTime picker component
     */
    error?: string
    /**
     * If true, both the date and time picker are disabled
     */
    disabled?: boolean
    /**
     * Id for the component
     */
    default12HourTime: OptionType
}

export interface DateTimePickerProps {
    /**
     * Current selected date object
     *
     * @default 'new Date()'
     */
    date?: Date
    /**
     * Handler for updating the date from the parent component
     */
    onChange: (date: Date) => void
    /**
     * Props for the date picker
     */
    datePickerProps?: any
    /**
     * Props for the time picker
     */
    timePickerProps?: SelectInstance
    /**
     * Error message for the DateTime picker component
     */
    error?: string
    /**
     * If true, both the date and time picker are disabled
     */
    disabled?: boolean
    /**
     * Id for the component
     */
    id: string
    /**
     * Label for the component
     */
    label?: string
    /**
     * If true, the field is required and asterisk is shown
     */
    required?: boolean
    /**
     * To hide time selector
     */
    hideTimeSelect?: boolean
    /**
     * To make the field read only
     */
    readOnly?: boolean
}
