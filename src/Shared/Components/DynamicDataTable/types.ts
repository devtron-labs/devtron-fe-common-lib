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

import { SortingOrder } from '@Common/Constants'

import { ResizableTagTextAreaProps } from '@Common/CustomTagSelector'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'
import { SelectTextAreaProps } from '../SelectTextArea'
import { FileUploadProps } from '../FileUpload'

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
    FILE_UPLOAD = 'file-upload',
}

export type DynamicDataTableCellPropsMap = {
    [DynamicDataTableRowDataType.TEXT]: Omit<
        ResizableTagTextAreaProps,
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
    [DynamicDataTableRowDataType.FILE_UPLOAD]: Omit<FileUploadProps, 'className' | 'fileName' | 'onUpload' | 'multiple'>
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
            /** An optional tooltip text to show when hovering over cell. */
            tooltipText?: string
        } & DynamicDataTableCellData
    }
    id: string | number
    /** */
    customState?: CustomStateType
    /** An optional boolean indicating if row deletion is disabled. */
    disableDelete?: boolean
}

type DynamicDataTableMask<K extends string> = {
    [key in K]?: boolean
}

type DynamicDataTableCellIcon<K extends string, CustomStateType = Record<string, unknown>> = {
    [key in K]?: (row: DynamicDataTableRowType<K, CustomStateType>) => ReactNode
}

/**
 * Interface representing the properties for the dynamic data table component.
 * @template K - A string representing the key type.
 */
export type DynamicDataTableProps<K extends string, CustomStateType = Record<string, unknown>> = {
    /**
     * An array containing the headers for the data table. \
     * Each header defines a column with its label, key, width, and optional settings.
     */
    headers: DynamicDataTableHeaderType<K>[]
    /**
     * An array of rows where each row contains data corresponding to the table headers.
     */
    rows: DynamicDataTableRowType<K, CustomStateType>[]
    /** Optional configuration for sorting the table. */
    sortingConfig?: {
        sortBy: K
        sortOrder: SortingOrder
        handleSorting: () => void
    }
    /** An optional mask to hide the values of the cell. */
    maskValue?: DynamicDataTableMask<K>
    /** Optional configuration for displaying an icon in the leading position of a cell. */
    leadingCellIcon?: DynamicDataTableCellIcon<K, CustomStateType>
    /** Optional configuration for displaying an icon in the trailing position of a cell. */
    trailingCellIcon?: DynamicDataTableCellIcon<K, CustomStateType>
    /** An optional function to render a custom wrapper component for the type `DynamicDataTableRowDataType.BUTTON`. */
    buttonCellWrapComponent?: (row: DynamicDataTableRowType<K, CustomStateType>) => ReactElement
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
        row: DynamicDataTableRowType<K, CustomStateType>,
        headerKey: K,
        value: string,
        extraData: {
            files?: File[]
            selectedValue?: SelectPickerOptionType<string>
        },
    ) => void
    /**
     * Function to handle row deletions.
     * @param row - The row that was deleted.
     */
    onRowDelete: (row: DynamicDataTableRowType<K, CustomStateType>) => void
    /** Optional configuration for rendering a custom action button in a row. */
    actionButtonConfig?: {
        /**
         * Function to render the action button.
         * @param row - The current row being rendered.
         * @returns A React node representing the action button.
         */
        renderer: (row: DynamicDataTableRowType<K, CustomStateType>) => ReactNode
        /**
         * This represents under which header key the action button will be rendered.
         */
        key: K
        /**
         * The width of the action button.
         * @default '32px'
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
        row: DynamicDataTableRowType<K, CustomStateType>,
    ) => {
        isValid: boolean
        errorMessages: string[]
    }
}

export interface DynamicDataTableHeaderProps<K extends string, CustomStateType = Record<string, unknown>>
    extends Pick<
        DynamicDataTableProps<K, CustomStateType>,
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

export interface DynamicDataTableRowProps<K extends string, CustomStateType = Record<string, unknown>>
    extends Pick<
        DynamicDataTableProps<K, CustomStateType>,
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
        | 'validationSchema'
        | 'leadingCellIcon'
        | 'trailingCellIcon'
        | 'buttonCellWrapComponent'
    > {}
