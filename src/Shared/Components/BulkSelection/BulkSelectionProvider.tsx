import { createContext, useContext, useMemo, useState } from 'react'
import { BULK_SELECTION_CONTEXT_ERROR, SELECT_ALL_ACROSS_PAGES_LOCATOR, getInvalidActionMessage } from './constants'
import {
    BulkSelectionEvents,
    GetBulkSelectionCheckboxValuesType,
    HandleBulkSelectionType,
    SelectAllDialogStatus,
    UseBulkSelectionProps,
    UseBulkSelectionReturnType,
} from './types'
import { CHECKBOX_VALUE, noop } from '../../../Common'

// giving type any here since not exporting this context, rather using it through useBulkSelection hook which is typed
const BulkSelectionContext = createContext<UseBulkSelectionReturnType<any>>({
    selectedIdentifiers: {},
    handleBulkSelection: noop,
    isChecked: false,
    checkboxValue: CHECKBOX_VALUE.CHECKED,
})

export const useBulkSelection = <T,>() => {
    const context = useContext<UseBulkSelectionReturnType<T>>(BulkSelectionContext)
    if (!context) {
        throw new Error(BULK_SELECTION_CONTEXT_ERROR)
    }
    return context
}

export const BulkSelectionProvider = <T,>({
    children,
    identifiers,
    getSelectAllDialogStatus,
}: UseBulkSelectionProps<T>) => {
    const [selectedIdentifiers, setSelectedIdentifiers] = useState<T>({} as T)

    const setIdentifiersAfterClear = (newIdentifiers: T, selectedIds: (number | string)[]) => {
        const _newIdentifiers = JSON.parse(JSON.stringify(newIdentifiers))
        selectedIds.forEach((id) => {
            delete _newIdentifiers[id]
        })
        setSelectedIdentifiers(_newIdentifiers)
    }

    const setIdentifiersAfterPageSelection = (baseObject: T) => {
        const _selectedIdentifiers = JSON.parse(JSON.stringify(selectedIdentifiers))
        // removing bulk selection across pages if present
        if (_selectedIdentifiers[SELECT_ALL_ACROSS_PAGES_LOCATOR]) {
            delete _selectedIdentifiers[SELECT_ALL_ACROSS_PAGES_LOCATOR]
        }

        setSelectedIdentifiers({
            ..._selectedIdentifiers,
            ...baseObject,
        })
    }

    const handleBulkSelection = ({ action, data }: HandleBulkSelectionType<T>) => {
        const selectedIds = data?.identifierIds ?? []
        const identifierObject = data?.identifierObject ?? {}

        switch (action) {
            case BulkSelectionEvents.CLEAR_ALL_SELECTIONS:
                setSelectedIdentifiers({} as T)
                break

            case BulkSelectionEvents.CLEAR_IDENTIFIERS_AFTER_ACROSS_SELECTION: {
                setIdentifiersAfterClear(identifiers, selectedIds)
                break
            }

            case BulkSelectionEvents.CLEAR_IDENTIFIERS: {
                setIdentifiersAfterClear(selectedIdentifiers, selectedIds)
                break
            }

            case BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES: {
                if (selectedIdentifiers[SELECT_ALL_ACROSS_PAGES_LOCATOR]) {
                    return
                }
                const selectedIdentifiersLength = Object.keys(selectedIdentifiers).length
                if (selectedIdentifiersLength > 0 && getSelectAllDialogStatus() === SelectAllDialogStatus.OPEN) {
                    return
                }

                setSelectedIdentifiers({
                    [SELECT_ALL_ACROSS_PAGES_LOCATOR]: true,
                } as unknown as T)
                break
            }

            case BulkSelectionEvents.CLEAR_SELECTIONS_AND_SELECT_ALL_ACROSS_PAGES:
                setSelectedIdentifiers({
                    [SELECT_ALL_ACROSS_PAGES_LOCATOR]: true,
                } as unknown as T)
                break

            case BulkSelectionEvents.SELECT_ALL_ON_PAGE: {
                setIdentifiersAfterPageSelection(identifiers)
                break
            }

            case BulkSelectionEvents.SELECT_IDENTIFIER: {
                setIdentifiersAfterPageSelection(identifierObject as T)
                break
            }

            default:
                throw new Error(getInvalidActionMessage(action))
        }
    }

    const getBulkSelectionCheckboxValues = (): GetBulkSelectionCheckboxValuesType => {
        const selectedIdentifiersArray = Object.keys(selectedIdentifiers)
        if (selectedIdentifiersArray.length === 0) {
            return {
                isChecked: false,
                checkboxValue: CHECKBOX_VALUE.CHECKED,
            }
        }

        // if selectedIdentifiers contains select all across pages locator then it means all are selected
        if (selectedIdentifiers[SELECT_ALL_ACROSS_PAGES_LOCATOR]) {
            return {
                isChecked: true,
                checkboxValue: CHECKBOX_VALUE.BULK_CHECKED,
            }
        }

        // if all the identifiers are selected then CHECKED else intermediate
        const areAllPresentIdentifiersSelected = selectedIdentifiersArray.every(
            (identifierId) => identifiers[identifierId],
        )

        if (areAllPresentIdentifiersSelected) {
            return {
                isChecked: true,
                checkboxValue: CHECKBOX_VALUE.CHECKED,
            }
        }

        return {
            isChecked: true,
            checkboxValue: CHECKBOX_VALUE.INTERMEDIATE,
        }
    }

    const { isChecked, checkboxValue } = getBulkSelectionCheckboxValues()

    const value = useMemo(
        () => ({
            selectedIdentifiers,
            handleBulkSelection,
            isChecked,
            checkboxValue,
        }),
        [selectedIdentifiers, handleBulkSelection, isChecked, checkboxValue],
    )

    return <BulkSelectionContext.Provider value={value}>{children}</BulkSelectionContext.Provider>
}
