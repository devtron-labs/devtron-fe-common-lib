import moment from 'moment'
import { DATE_TIME_FORMATS, ZERO_TIME_STRING } from '@Common/Constants'

export const getParsedUpdatedOnDate = (updatedOn: string) => {
    if (!updatedOn || updatedOn === ZERO_TIME_STRING) {
        return ''
    }

    const _moment = moment(updatedOn)

    return _moment.isValid() ? _moment.format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT) : updatedOn
}
