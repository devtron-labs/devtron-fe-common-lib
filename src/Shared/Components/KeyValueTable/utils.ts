import { UseStateFiltersReturnType } from '@Common/Hooks'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { getUniqueId, stringComparatorBySortOrder } from '@Shared/Helpers'

import { DynamicDataTableCellValidationState, DynamicDataTableRowDataType } from '../DynamicDataTable'
import { DUPLICATE_KEYS_VALIDATION_MESSAGE, EMPTY_KEY_VALIDATION_MESSAGE } from './constants'
import {
    KeyValueTableData,
    KeyValueTableDataType,
    KeyValueTableInternalProps,
    KeyValueTableProps,
    KeyValueValidationSchemaProps,
} from './KeyValueTable.types'

export const getModifiedDataForOnChange = (rows: KeyValueTableInternalProps['rows']): KeyValueTableData[] =>
    rows.map(({ data, id }) => ({ id, key: data.key.value, value: data.value.value }))

export const getEmptyRow = (
    placeholder: KeyValueTableProps['placeholder'],
): KeyValueTableInternalProps['rows'][number] => ({
    id: getUniqueId(),
    data: {
        key: {
            type: DynamicDataTableRowDataType.TEXT,
            props: { placeholder: placeholder.key },
            value: '',
        },
        value: {
            type: DynamicDataTableRowDataType.TEXT,
            props: { placeholder: placeholder.value },
            value: '',
        },
    },
})

export const getKeyValueTableRows = ({
    rows: initialRows,
    placeholder,
    maskValue,
}: Required<Pick<KeyValueTableProps, 'rows' | 'placeholder' | 'maskValue'>>): KeyValueTableInternalProps['rows'] => {
    const isMaskValue = maskValue && Object.keys(maskValue).length

    const rows: KeyValueTableInternalProps['rows'] = initialRows?.length
        ? initialRows.map(({ data: { key, value }, id }) => ({
              data: {
                  key: {
                      ...key,
                      type: DynamicDataTableRowDataType.TEXT,
                      value: isMaskValue && maskValue.key ? DEFAULT_SECRET_PLACEHOLDER : key.value,
                      props: { placeholder: placeholder.key },
                  },
                  value: {
                      ...value,
                      type: DynamicDataTableRowDataType.TEXT,
                      value: isMaskValue && maskValue.value ? DEFAULT_SECRET_PLACEHOLDER : value.value,
                      props: { placeholder: placeholder.value },
                  },
              },
              id,
          }))
        : [getEmptyRow(placeholder)]

    return rows
}

export const getKeyValueTableSortedRows = ({
    rows,
    sortBy,
    sortOrder,
}: Required<Pick<UseStateFiltersReturnType<KeyValueTableDataType>, 'sortBy' | 'sortOrder'>> &
    Pick<KeyValueTableInternalProps, 'rows'>) =>
    rows
        .map((item) => item)
        .sort((a, b) => stringComparatorBySortOrder(a.data[sortBy].value, b.data[sortBy].value, sortOrder))

export const getKeyValueHeaders = ({
    headerLabel,
    isSortable,
}: Pick<KeyValueTableProps, 'headerLabel' | 'isSortable'>): KeyValueTableInternalProps['headers'] => [
    { key: 'key', label: headerLabel.key, width: '30%', isSortable },
    { key: 'value', label: headerLabel.value, width: '1fr' },
]

const getKeyValueTableKeysFrequency = (rows: KeyValueTableInternalProps['rows']) =>
    rows.reduce(
        (acc, curr) => {
            const currentKey = curr.data.key.value
            if (currentKey) {
                acc[currentKey] = (acc[currentKey] || 0) + 1
            }
            return acc
        },
        {} as Record<string, number>,
    )

const validationSchema = ({
    value,
    key,
    row,
    validateDuplicateKeys,
    validateEmptyKeys,
    validationSchema: parentValidationSchema,
    rows = [],
    keysFrequency = {},
}: KeyValueValidationSchemaProps): DynamicDataTableCellValidationState => {
    const trimmedValue = value.trim()

    if (validateDuplicateKeys && key === 'key' && (keysFrequency[trimmedValue] ?? 0) > 1) {
        return {
            isValid: false,
            errorMessages: [DUPLICATE_KEYS_VALIDATION_MESSAGE],
        }
    }

    if (validateEmptyKeys && key === 'key' && !trimmedValue) {
        const isValuePresentAtRow = rows.some(({ id, data }) => id === row.id && data.value.value.trim())
        if (isValuePresentAtRow) {
            return {
                isValid: false,
                errorMessages: [EMPTY_KEY_VALIDATION_MESSAGE],
            }
        }
    }

    if (parentValidationSchema) {
        const { isValid, errorMessages } = parentValidationSchema(value, key, row)
        return {
            isValid,
            errorMessages: errorMessages || [],
        }
    }

    return {
        isValid: true,
        errorMessages: [],
    }
}

export const getKeyValueTableCellError = ({
    validateDuplicateKeys,
    validateEmptyKeys,
    validationSchema: parentValidationSchema,
    rows,
}: Pick<KeyValueValidationSchemaProps, 'validateDuplicateKeys' | 'validateEmptyKeys' | 'validationSchema' | 'rows'> & {
    skipValidationIfValueIsEmpty?: boolean
}) => {
    let isValid = true

    const updatedCellError = rows.reduce((acc, row) => {
        const keyError = validationSchema({
            rows,
            value: row.data.key.value,
            key: 'key',
            row,
            validateDuplicateKeys,
            validateEmptyKeys,
            validationSchema: parentValidationSchema,
            keysFrequency: validateDuplicateKeys ? getKeyValueTableKeysFrequency(rows) : {},
        })

        const valueError = validationSchema({
            value: row.data.value.value,
            key: 'value',
            row,
            validationSchema: parentValidationSchema,
        })

        if (isValid && !(keyError.isValid && valueError.isValid)) {
            isValid = false
        }

        acc[row.id] = {
            key: keyError,
            value: valueError,
        }

        return acc
    }, {})

    return { isValid, updatedCellError }
}
