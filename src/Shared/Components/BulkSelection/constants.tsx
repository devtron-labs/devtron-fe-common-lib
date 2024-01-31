import { BulkSelectionEvents } from './types'

export const BULK_DROPDOWN_TEST_ID = 'bulk-selection-pop-up-menu' as const
export const BulkSelectionOptionsLabels = {
    [BulkSelectionEvents.SELECT_ALL_ON_PAGE]: 'All on this page',
    [BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES]: 'All across pages',
    [BulkSelectionEvents.CLEAR_ALL_SELECTIONS]: 'Clear all selections',
} as const

// Considering application can not be named as *
export const SELECT_ALL_ACROSS_PAGES_LOCATOR = '*' as const
export const getInvalidActionMessage = (action: string) => `Invalid action ${action} passed to useBulkSelection`
