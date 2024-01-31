import { useState } from 'react'
import { SELECT_ALL_ACROSS_PAGES_LOCATOR, getInvalidActionMessage } from './constants'
import {
    BulkSelectionEvents,
    HandleBulkSelectionType,
    SelectAllDialogStatus,
    UseBulkSelectionProps,
    UseBulkSelectionReturnType,
} from './types'

const useBulkSelection = <T,>({
    identifiers,
    getSelectAllDialogStatus,
}: UseBulkSelectionProps<T>): UseBulkSelectionReturnType<T> => {
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

    return {
        handleBulkSelection,
        selectedIdentifiers,
    }
}

export default useBulkSelection
