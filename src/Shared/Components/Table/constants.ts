export const SEARCH_SORT_CHANGE_DEBOUNCE_TIME = 350 /** in ms */

export const LOCAL_STORAGE_EXISTS = !!(Storage && localStorage)

export const LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS = 'generic-table-configurable-columns'

export const BULK_ACTION_GUTTER_LABEL = 'bulk-action-gutter'

export const EVENT_TARGET = new EventTarget()

export const DRAG_SELECTOR_IDENTIFIER = 'table-drag-selector'

export const SHIMMER_DUMMY_ARRAY = [1, 2, 3]

export const NO_ROWS_OR_GET_ROWS_ERROR = new Error('Neither rows nor getRows function provided')
