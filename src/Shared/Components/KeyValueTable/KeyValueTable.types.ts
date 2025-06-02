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

import { TooltipProps } from '@Common/Tooltip'

import { DynamicDataTableProps } from '../DynamicDataTable'

export type KeyValueTableDataType = 'key' | 'value'

export type KeyValueTableInternalProps = DynamicDataTableProps<KeyValueTableDataType, never>

type ErrorUIProps =
    | {
          /**
           * Indicates whether to show errors.
           */
          showError: true
          /**
           * @default - false
           * If true, would validate for duplicate keys and if present would show error tooltip on the cell.
           */
          validateDuplicateKeys?: boolean
          /**
           * @default - false
           * If true, would validate for rows having values but no key and if error would show error tooltip on the cell.
           */
          validateEmptyKeys?: boolean
      }
    | {
          /**
           * Indicates whether to show errors.
           */
          showError?: false
          validateDuplicateKeys?: never
          validateEmptyKeys?: never
      }

export type KeyValueHeaderLabel<K extends KeyValueTableDataType = KeyValueTableDataType> = {
    [key in K]: string
}

export type KeyValueMask<K extends KeyValueTableDataType = KeyValueTableDataType> = {
    [key in K]?: boolean
}

export type KeyValuePlaceholder<K extends KeyValueTableDataType = KeyValueTableDataType> = {
    [key in K]?: string
}

export interface KeyValueTableRowType<K extends KeyValueTableDataType = KeyValueTableDataType> {
    id: string | number
    data: {
        [key in K]: {
            value: string
            /** An optional boolean indicating if the cell should be marked as disabled. */
            disabled?: boolean
            /** An optional boolean indicating if an asterisk should be shown. */
            required?: boolean
            /** An optional tooltip to show when hovering over cell. */
            tooltip?: Partial<Pick<TooltipProps, 'content' | 'className'>>
        }
    }
}

export interface KeyValueTableData extends Pick<KeyValueTableRowType, 'id'> {
    key: string
    value: string
}

/**
 * Props for the KeyValueTable component.
 */
export type KeyValueTableProps = Pick<
    DynamicDataTableProps<KeyValueTableDataType>,
    'isAdditionNotAllowed' | 'readOnly' | 'headerComponent' | 'shouldAutoFocusOnMount'
> & {
    /**
     * The label for the table header.
     */
    headerLabel: KeyValueHeaderLabel
    /**
     * The rows of the key-value table.
     */
    rows: KeyValueTableRowType[]
    /**
     * An optional configuration to mask values in the table.
     */
    maskValue?: KeyValueMask
    /**
     * An optional placeholder configuration for the table columns.
     */
    placeholder?: KeyValuePlaceholder
    /**
     * An optional boolean indicating if the `key` column is sortable.
     */
    isSortable?: boolean
    /**
     * A callback function triggered when the table rows change.
     *
     * @param data - The updated table data.
     */
    onChange: (data: KeyValueTableData[]) => void
    /**
     * A function to validate the value of a cell.
     *
     * @param value - The value to validate.
     * @param key - The key of the header associated with the value.
     * @param row - The row containing the value.
     * @returns A boolean indicating whether the value is valid. If false,
     *          `showError` should be set to `true` and `errorMessages` should
     *          provide an array of error messages to display.
     */
    validationSchema?: (
        value: string,
        key: KeyValueTableDataType,
        row: KeyValueTableRowType,
    ) => {
        /** Boolean indicating if the cell data is valid or not. */
        isValid: boolean
        /**
         * An array of error messages to display in the cell error tooltip.
         */
        errorMessages?: string[]
    }
    /**
     * A callback function triggered when an error occurs in the table.
     *
     * @param errorState - A boolean indicating the error state. True if any
     *                     cell has an error, otherwise false.
     */
    onError?: (errorState: boolean) => void
} & ErrorUIProps

export type KeyValueValidationSchemaProps = {
    value: Parameters<KeyValueTableProps['validationSchema']>[0]
    key: Parameters<KeyValueTableProps['validationSchema']>[1]
    row: Parameters<KeyValueTableProps['validationSchema']>[2]
    keysFrequency?: Record<string, number>
} & Pick<KeyValueTableProps, 'validateDuplicateKeys' | 'validateEmptyKeys' | 'validationSchema'> &
    Partial<Pick<KeyValueTableInternalProps, 'rows'>>
