import moment from 'moment'
import { ZERO_TIME_STRING } from '../Common'

interface HighlightSearchTextProps {
    /**
     * The text to be highlighted
     */
    searchText: string
    /**
     * The whole text string
     */
    text: string
    /**
     * The classes to be applied to the highlighted text
     */
    highlightClasses?: string
}

// Disabling default export since this is a helper function and we would have to export a lot of functions in future.
// eslint-disable-next-line import/prefer-default-export
export const highlightSearchText = ({ searchText, text, highlightClasses }: HighlightSearchTextProps): string => {
    if (!searchText) {
        return text
    }

    try {
        const regex = new RegExp(searchText, 'gi')
        return text.replace(regex, (match) => `<span class="${highlightClasses}">${match}</span>`)
    } catch (error) {
        return text
    }
}

export function ISTTimeModal(ts: string, isRelativeTime = false) {
    let timestamp = ''
    try {
        if (ts && ts.length) {
            const date = moment(ts)
            if (isRelativeTime) {
                // check for minimum date (zero date) (Invoking an empty time.Time struct literal will return Go's zero date)
                if (ts !== ZERO_TIME_STRING) {
                    timestamp = date.fromNow()
                }
            } else {
                timestamp = date.format('ddd DD MMM YYYY HH:mm:ss')
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error Parsing Date:', ts)
    }
    return timestamp
}
