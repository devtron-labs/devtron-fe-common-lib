import { CHECKBOX_VALUE } from '../../../Common'

export enum BulkSelectionEvents {
    CLEAR_ALL_SELECTIONS = 'CLEAR_ALL_SELECTIONS',
    CLEAR_IDENTIFIERS = 'CLEAR_IDENTIFIERS',
    SELECT_ALL_ACROSS_PAGES = 'SELECT_ALL_ACROSS_PAGES',
    SELECT_ALL_ON_PAGE = 'SELECT_ALL_ON_PAGE',
    SELECT_IDENTIFIER = 'SELECT_IDENTIFIER',
    CLEAR_IDENTIFIERS_AFTER_ACROSS_SELECTION = 'CLEAR_IDENTIFIERS_AFTER_ACROSS_SELECTION',
    CLEAR_SELECTIONS_AND_SELECT_ALL_ACROSS_PAGES = 'CLEAR_SELECTIONS_AND_SELECT_ALL_ACROSS_PAGES',
}

export interface HandleBulkSelectionType<T> {
    action: BulkSelectionEvents
    data?: {
        identifierIds?: (number | string)[]
        identifierObject?: T
    }
}

export interface GetBulkSelectionCheckboxValuesType {
    isChecked: boolean
    checkboxValue: CHECKBOX_VALUE
}

export interface UseBulkSelectionReturnType<T> extends GetBulkSelectionCheckboxValuesType {
    selectedIdentifiers: T
    handleBulkSelection: ({ action, data }: HandleBulkSelectionType<T>) => void
    isBulkSelectionApplied: boolean
    getSelectedIdentifiersCount: () => number
}

export interface BulkSelectionProps {
    showPagination: boolean
    disabled?: boolean
}

export interface BulkSelectionDropdownItemsType {
    locator: BulkSelectionEvents
    label: string
    isSelected: boolean
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    iconClass?: string
}

export interface BulkSelectionDropdownItemsProps<T>
    extends BulkSelectionDropdownItemsType,
        Pick<UseBulkSelectionReturnType<T>, 'handleBulkSelection'> {}

export enum SelectAllDialogStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

// This type is intended to be used with UseBulkSelectionProps, e.g, UseBulkSelectionProps<BulkSelectionIdentifiersType<boolean>>
export type BulkSelectionIdentifiersType<T> = Record<string | number, T>

export interface UseBulkSelectionProps<T> {
    /**
     * Response from API, assuming structure to be array of objects with key and values
     * This will the given ids on current page
     */
    identifiers: T
    /**
     * Act as buffer between select all across pages and select all on page state
     */
    getSelectAllDialogStatus: () => SelectAllDialogStatus
    children?: React.ReactNode
}
