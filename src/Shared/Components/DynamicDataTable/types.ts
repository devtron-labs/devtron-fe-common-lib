/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DetailedHTMLProps, ReactNode } from 'react'

import { SortingOrder } from '@Common/Constants'

import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'
import { MultipleResizableTextAreaProps } from '../MultipleResizableTextArea'
import { SelectTextAreaProps } from '../SelectTextArea'

/**
 * Interface representing a key-value header.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableHeaderType<K extends string> = {
    /** The label of the header. */
    label: string
    /** The key associated with the header. */
    key: K
    /** */
    width: string
    /** An optional boolean indicating if the column is sortable. */
    isSortable?: boolean
    /** An optional boolean to hide the column */
    isHidden?: boolean
}

export enum DynamicDataTableRowDataType {
    TEXT = 'text',
    DROPDOWN = 'dropdown',
    SELECT_TEXT = 'select-text',
    BUTTON = 'button',
}

/**
 * Type representing a key-value row.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableRowType<K extends string> = {
    data: {
        [key in K]: {
            value: string
            disabled?: boolean
            /** An optional boolean indicating if an asterisk should be shown. */
            required?: boolean
        } & (
            | {
                  type?: DynamicDataTableRowDataType.TEXT
                  props?: Omit<
                      MultipleResizableTextAreaProps,
                      | 'className'
                      | 'minHeight'
                      | 'maxHeight'
                      | 'value'
                      | 'onChange'
                      | 'disabled'
                      | 'disableOnBlurResizeToMinHeight'
                      | 'refVar'
                      | 'dependentRefs'
                  >
              }
            | {
                  type?: DynamicDataTableRowDataType.DROPDOWN
                  props?: Omit<
                      SelectPickerProps<string, false>,
                      'inputId' | 'value' | 'onChange' | 'fullWidth' | 'isDisabled'
                  >
              }
            | {
                  type?: DynamicDataTableRowDataType.SELECT_TEXT
                  props?: Omit<
                      SelectTextAreaProps,
                      'value' | 'onChange' | 'inputId' | 'isDisabled' | 'dependentRefs' | 'refVar' | 'textAreaProps'
                  > & {
                      textAreaProps?: Omit<
                          SelectTextAreaProps['textAreaProps'],
                          'className' | 'disableOnBlurResizeToMinHeight' | 'minHeight' | 'maxHeight'
                      >
                  }
              }
            | ({
                  type?: DynamicDataTableRowDataType.BUTTON
                  props: Pick<
                      DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
                      'onClick'
                  > & {
                      icon?: ReactNode
                      text: ReactNode
                  }
              } & (
                  | {
                        wrap: true
                        wrapRenderer: (props: {
                            children: JSX.Element
                            customState?: Record<string, any>
                        }) => JSX.Element
                    }
                  | {
                        wrap?: false
                        wrapRenderer?: never
                    }
              ))
        )
    }
    id: string | number
    /** */
    customState?: Record<string, any>
}

/**
 * Type representing a mask for key-value pairs.
 * @template K - A string representing the key type.
 */
type DynamicDataTableMask<K extends string> = {
    [key in K]?: boolean
}

type DynamicDataTableCellIcon<K extends string> = {
    [key in K]?: (rowId: string | number) => ReactNode
}

/**
 * Interface representing the properties for a key-value table component.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableProps<K extends string> = {
    /** An array containing two key-value headers. */
    headers: DynamicDataTableHeaderType<K>[]
    /** An array of key-value rows. */
    rows: DynamicDataTableRowType<K>[]
    /** */
    sortingConfig?: {
        sortBy: K
        sortOrder: SortingOrder
        handleSorting: () => void
    }
    /** An optional mask for the key-value pairs. */
    maskValue?: DynamicDataTableMask<K>
    /** */
    leadingCellIcon?: DynamicDataTableCellIcon<K>
    /** */
    trailingCellIcon?: DynamicDataTableCellIcon<K>
    /** An optional React node for a custom header component. */
    headerComponent?: ReactNode
    /** When true, data addition field will not be shown. */
    isAdditionNotAllowed?: boolean
    /** When true, data addition field will not be shown. */
    isDeletionNotAllowed?: boolean
    /** When true, data add or update is disabled. */
    readOnly?: boolean
    /** */
    onRowAdd: () => void
    /**
     * Function to handle changes in the table rows.
     * @param row - The row that changed.
     * @param headerKey - The key of the header that changed.
     * @param value - The value of the cell.
     */
    onRowEdit: (
        row: DynamicDataTableRowType<K>,
        headerKey: K,
        value: string,
        extraData: {
            selectedValue?: SelectPickerOptionType<string>
        },
    ) => void
    /**
     * Function to handle row deletions.
     * @param row - The row that was deleted.
     */
    onRowDelete: (row: DynamicDataTableRowType<K>) => void
    /** */
    actionButtonConfig?: {
        renderer: (row: DynamicDataTableRowType<K>) => ReactNode
        key?: K
        /**
         * @default '32px'
         */
        width?: string
        /**
         * @default 'start'
         */
        position?: 'start' | 'end'
    }
    /**
     * Indicates whether to show errors.
     */
    showError?: boolean
    /**
     * An array of error messages to be displayed in the cell error tooltip.
     */
    errorMessages?: string[]
    /**
     * The function to use to validate the value of the cell.
     * @param value - The value to validate.
     * @param key - The row key of the value.
     * @param rowId - The id of the row.
     * @returns Return true if the value is valid, otherwise false
     * and set `showError` to `true` and provide errorMessages array to show error message.
     */
    validationSchema?: (value: string, key: K, rowId: string | number) => boolean
}

export interface DynamicDataTableHeaderProps<K extends string>
    extends Pick<
        DynamicDataTableProps<K>,
        | 'headers'
        | 'rows'
        | 'headerComponent'
        | 'sortingConfig'
        | 'onRowAdd'
        | 'readOnly'
        | 'isAdditionNotAllowed'
        | 'isDeletionNotAllowed'
        | 'actionButtonConfig'
    > {}

export interface DynamicDataTableRowProps<K extends string>
    extends Pick<
        DynamicDataTableProps<K>,
        | 'rows'
        | 'headers'
        | 'maskValue'
        | 'isAdditionNotAllowed'
        | 'isDeletionNotAllowed'
        | 'readOnly'
        | 'onRowEdit'
        | 'onRowDelete'
        | 'actionButtonConfig'
        | 'showError'
        | 'errorMessages'
        | 'validationSchema'
        | 'leadingCellIcon'
        | 'trailingCellIcon'
    > {}
