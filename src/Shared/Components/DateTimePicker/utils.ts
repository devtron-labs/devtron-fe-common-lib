import moment from 'moment'

export const getIsDateOutsideRange = (day: moment.Moment) => moment().startOf('day').isBefore(day, 'day')
