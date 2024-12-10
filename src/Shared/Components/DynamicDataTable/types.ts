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

import { DetailedHTMLProps, ReactElement, ReactNode } from 'react'

import { ResizableTagTextAreaProps } from '@Common/CustomTagSelector'
import { UseStateFiltersReturnType } from '@Common/Hooks'

import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'
import { SelectTextAreaProps } from '../SelectTextArea'

/**
 * Interface representing header for a dynamic data table.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableHeaderType<K extends string> = {
    /** The display label of the header, shown in the table's column header. */
    label: string
    /** The unique key associated with the header, used to map the column to data fields. */
    key: K
    /** The width of the column, defined as a CSS string (e.g., "100px", "10%", "1fr", or "auto"). */
    width: string
    /** An optional boolean indicating whether the column is sortable. */
    isSortable?: boolean
    /** An optional boolean to control the visibility of the column. */
    isHidden?: boolean
}

export enum DynamicDataTableRowDataType {
    TEXT = 'text',
    DROPDOWN = 'dropdown',
    SELECT_TEXT = 'select-text',
    BUTTON = 'button',
}

export type DynamicDataTableCellPropsMap = {
    [DynamicDataTableRowDataType.TEXT]: Omit<
        ResizableTagTextAreaProps,
        | 'id'
        | 'className'
        | 'minHeight'
        | 'maxHeight'
        | 'value'
        | 'onChange'
        | 'disabled'
        | 'disableOnBlurResizeToMinHeight'
        | 'refVar'
        | 'dependentRef'
    >
    [DynamicDataTableRowDataType.DROPDOWN]: Omit<
        SelectPickerProps<string, false>,
        'inputId' | 'value' | 'onChange' | 'fullWidth' | 'isDisabled'
    >
    [DynamicDataTableRowDataType.SELECT_TEXT]: Omit<
        SelectTextAreaProps,
        'value' | 'onChange' | 'inputId' | 'isDisabled' | 'dependentRef' | 'refVar' | 'textAreaProps'
    > & {
        textAreaProps?: Omit<
            SelectTextAreaProps['textAreaProps'],
            'className' | 'disableOnBlurResizeToMinHeight' | 'minHeight' | 'maxHeight'
        >
    }
    [DynamicDataTableRowDataType.BUTTON]: Pick<
        DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
        'onClick'
    > & {
        icon?: ReactNode
        text: string
    }
}

type DynamicDataTableCellData<T extends keyof DynamicDataTableCellPropsMap = keyof DynamicDataTableCellPropsMap> =
    T extends keyof DynamicDataTableCellPropsMap ? { type: T; props: DynamicDataTableCellPropsMap[T] } : never

/**
 * Type representing a key-value row.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableRowType<K extends string, CustomStateType = Record<string, unknown>> = {
    data: {
        [key in K]: {
            value: string
            disabled?: boolean
            /** An optional boolean indicating if an asterisk should be shown. */
            required?: boolean
        } & DynamicDataTableCellData
    }
    id: string | number
    /** */
    customState?: CustomStateType
    /** An optional boolean indicating if row deletion is disabled. */
    disableDelete?: boolean
}

type DynamicDataTableCellIcon<K extends string> = {
    [key in K]?: (row: DynamicDataTableRowType<K>) => ReactNode
}

/**
 * Interface representing the properties for the dynamic data table component.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableProps<K extends string> = {
    /**
     * An array containing the headers for the data table. \
     * Each header defines a column with its label, key, width, and optional settings.
     */
    headers: DynamicDataTableHeaderType<K>[]
    /**
     * An array of rows where each row contains data corresponding to the table headers.
     */
    rows: DynamicDataTableRowType<K>[]
    /** Optional configuration for sorting the table. */
    sortingConfig?: Pick<UseStateFiltersReturnType<K>, 'sortBy' | 'sortOrder' | 'handleSorting'>
    /** Optional configuration for displaying an icon in the leading position of a cell. */
    leadingCellIcon?: DynamicDataTableCellIcon<K>
    /** Optional configuration for displaying an icon in the trailing position of a cell. */
    trailingCellIcon?: DynamicDataTableCellIcon<K>
    /** An optional function to render a custom wrapper component for the type `DynamicDataTableRowDataType.BUTTON`. */
    buttonCellWrapComponent?: (row: DynamicDataTableRowType<K>) => ReactElement
    /** An optional React node for a custom header component. */
    headerComponent?: ReactNode
    /** When true, data addition field will not be shown. */
    isAdditionNotAllowed?: boolean
    /** When true, data addition field will not be shown. */
    isDeletionNotAllowed?: boolean
    /** When true, data add or update is disabled. */
    readOnly?: boolean
    /** Function to handle the addition of a new row to the table. */
    onRowAdd: () => void
    /**
     * Function to handle changes in the table rows.
     * @param row - The row that changed.
     * @param headerKey - The key of the header that changed.
     * @param value - The value of the cell.
     * @param extraData - Additional data, such as a selected value for dropdowns.
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
    /** Optional configuration for rendering a custom action button in a row. */
    actionButtonConfig?: {
        /**
         * Function to render the action button.
         * @param row - The current row being rendered.
         * @returns A React node representing the action button.
         */
        renderer: (row: DynamicDataTableRowType<K>) => ReactNode
        /**
         * This represents under which header key the action button will be rendered.
         */
        key: K
        /**
         * The width of the action button.
         * @default '33px'
         */
        width?: string
        /**
         * The position of the action button under the header key.
         * @default 'start'
         */
        position?: 'start' | 'end'
    }
    /**
     * Indicates whether to show errors.
     */
    showError?: boolean
    /**
     * Function to validate the value of a table cell.
     * @param value - The value to validate.
     * @param key - The column key of the cell.
     * @param row - The row containing the cell.
     * @returns An object with a boolean indicating validity and an array of error messages.
     */
    validationSchema?: (
        value: string,
        key: K,
        row: DynamicDataTableRowType<K>,
    ) => {
        isValid: boolean
        errorMessages: string[]
    }
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
        | 'isAdditionNotAllowed'
        | 'isDeletionNotAllowed'
        | 'readOnly'
        | 'onRowEdit'
        | 'onRowDelete'
        | 'actionButtonConfig'
        | 'showError'
        | 'validationSchema'
        | 'leadingCellIcon'
        | 'trailingCellIcon'
        | 'buttonCellWrapComponent'
    > {}
