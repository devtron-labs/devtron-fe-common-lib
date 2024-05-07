import moment from 'moment'
import { OptionType } from '../../../Common'

type TimeSelectOption = OptionType & { isDisabled?: boolean }

export interface BaseDateTimePickerProps {
    showTimeZone?: boolean
    showTime?: boolean
    showDate?: boolean
    label?: string
    isRequired?: boolean
    defaultTime?: string
    timePlaceholder?: string
    datePlaceholder?: string
    dateFormat?: string
    date?: moment.Moment
    time?: TimeSelectOption
    handleDateChange: (selected) => void
    dateId?: string
    /**
     * Defaults to 30 minutes
     */
    timeOptionsDifference?: number
    handleTimeChange?: (changedTimeOption: TimeSelectOption) => void
}

export interface DateTimePickerProps extends BaseDateTimePickerProps {}
