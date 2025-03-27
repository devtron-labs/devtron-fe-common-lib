import { useRegisterShortcut } from '@Common/Hooks'
import { useState, useRef, useCallback, useEffect } from 'react'
import { noop } from 'rxjs'
import { BulkSelectionEvents } from '../BulkSelection'
import { InternalTablePropsWithWrappers, RowsType, SignalEnum } from './types'
import { EVENT_TARGET } from './constants'

const useTableWithKeyboardShortcuts = (
    {
        bulkSelectionConfig,
        handleToggleBulkSelectionOnRow,
        bulkSelectionReturnValue,
    }: Pick<
        InternalTablePropsWithWrappers,
        'bulkSelectionConfig' | 'bulkSelectionReturnValue' | 'handleToggleBulkSelectionOnRow'
    >,
    visibleRows: RowsType,
) => {
    const isBulkSelectionConfigured = !!bulkSelectionConfig

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const { handleBulkSelection } = bulkSelectionReturnValue

    const [activeRowIndex, setActiveRowIndex] = useState<number>(0)

    const consecutiveSequencesForBulkSelectionRef = useRef<{ count: number; type: string }>({ count: 0, type: '' })

    const dispatchEvent = useCallback(
        (signal: SignalEnum) => {
            EVENT_TARGET.dispatchEvent(
                new CustomEvent(signal, { detail: { activeRowData: visibleRows[activeRowIndex] } }),
            )
        },
        [activeRowIndex, visibleRows],
    )

    useEffect(() => {
        dispatchEvent(SignalEnum.ACTIVE_ROW_CHANGED)
    }, [activeRowIndex])

    const getMoveFocusToNextRowHandler = useCallback(
        (type: string) => {
            consecutiveSequencesForBulkSelectionRef.current =
                type === consecutiveSequencesForBulkSelectionRef.current.type
                    ? { count: consecutiveSequencesForBulkSelectionRef.current.count + 1, type }
                    : { count: 1, type }

            const newActiveRowIndex = Math.min(activeRowIndex + 1, visibleRows.length - 1)

            // NOTE: using a ref here so that we don't end up with a stale closure
            // If we had gone with a normal state, the callback would have been using the initial state
            // unless the register the callback every time the state changes
            setActiveRowIndex(newActiveRowIndex)

            return {
                consecutiveSequencesForBulkSelection: consecutiveSequencesForBulkSelectionRef.current.count,
                activeRowIndex: newActiveRowIndex,
            }
        },
        [activeRowIndex, visibleRows],
    )

    const getMoveFocusToPreviousRowHandler = useCallback(
        (type: string) => {
            consecutiveSequencesForBulkSelectionRef.current =
                type === consecutiveSequencesForBulkSelectionRef.current.type
                    ? { count: consecutiveSequencesForBulkSelectionRef.current.count + 1, type }
                    : { count: 1, type }

            const newActiveRowIndex = Math.max(activeRowIndex - 1, 0)

            setActiveRowIndex(newActiveRowIndex)

            return {
                consecutiveSequencesForBulkSelection: consecutiveSequencesForBulkSelectionRef.current.count,
                activeRowIndex: newActiveRowIndex,
            }
        },
        [activeRowIndex],
    )

    useEffect(() => {
        registerShortcut({
            keys: ['ArrowDown'],
            callback: () => {
                getMoveFocusToNextRowHandler('arrow-down')
            },
        })

        registerShortcut({
            keys: ['ArrowUp'],
            callback: () => {
                getMoveFocusToPreviousRowHandler('arrow-up')
            },
        })

        registerShortcut({
            keys: ['Enter'],
            callback: () => {
                dispatchEvent(SignalEnum.ENTER_PRESSED)
            },
        })

        registerShortcut({
            keys: ['Delete'],
            callback: () => {
                dispatchEvent(SignalEnum.DELETE_PRESSED)
            },
        })

        registerShortcut({
            keys: ['.'],
            callback: () => {
                dispatchEvent(SignalEnum.OPEN_CONTEXT_MENU)
            },
        })

        return () => {
            unregisterShortcut(['ArrowDown'])
            unregisterShortcut(['ArrowUp'])
            unregisterShortcut(['Enter'])
            unregisterShortcut(['Delete'])
            unregisterShortcut(['.'])
        }
    }, [getMoveFocusToNextRowHandler, getMoveFocusToPreviousRowHandler, dispatchEvent])

    useEffect(() => {
        if (!isBulkSelectionConfigured) {
            return noop
        }

        registerShortcut({
            keys: ['Shift', 'ArrowDown'],
            callback: () => {
                const { consecutiveSequencesForBulkSelection, activeRowIndex: newActiveRowIndex } =
                    getMoveFocusToNextRowHandler('shift-arrow-down')

                if (activeRowIndex === newActiveRowIndex) {
                    return
                }

                const oldActiveRow = visibleRows[activeRowIndex]
                const newActiveRow = visibleRows[newActiveRowIndex]

                handleBulkSelection({
                    action: BulkSelectionEvents.SELECT_IDENTIFIER,
                    data: {
                        identifierObject: {
                            ...(consecutiveSequencesForBulkSelection === 1 ? { [oldActiveRow.id]: oldActiveRow } : {}),
                            [newActiveRow.id]: newActiveRow,
                        },
                    },
                })
            },
        })

        registerShortcut({
            keys: ['Shift', 'ArrowUp'],
            callback: () => {
                const { consecutiveSequencesForBulkSelection, activeRowIndex: newActiveRowIndex } =
                    getMoveFocusToPreviousRowHandler('shift-arrow-up')

                if (activeRowIndex === newActiveRowIndex) {
                    return
                }

                const oldActiveRow = visibleRows[activeRowIndex]
                const newActiveRow = visibleRows[newActiveRowIndex]

                handleBulkSelection({
                    action: BulkSelectionEvents.SELECT_IDENTIFIER,
                    data: {
                        identifierObject: {
                            ...(consecutiveSequencesForBulkSelection === 1 ? { [oldActiveRow.id]: oldActiveRow } : {}),
                            [newActiveRow.id]: newActiveRow,
                        },
                    },
                })
            },
        })

        registerShortcut({
            keys: ['X'],
            callback: () => {
                handleToggleBulkSelectionOnRow(visibleRows[activeRowIndex])
            },
        })

        return () => {
            unregisterShortcut(['Shift', 'ArrowUp'])
            unregisterShortcut(['Shift', 'ArrowDown'])
            unregisterShortcut(['X'])
        }
    }, [
        getMoveFocusToNextRowHandler,
        getMoveFocusToPreviousRowHandler,
        activeRowIndex,
        visibleRows,
        handleToggleBulkSelectionOnRow,
    ])

    return {
        activeRowIndex,
    }
}

export default useTableWithKeyboardShortcuts
