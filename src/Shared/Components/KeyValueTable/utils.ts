import { getUniqueId } from '@Shared/Helpers'

import { DynamicDataTableRowDataType } from '../DynamicDataTable'
import { KeyValueTableData, KeyValueTableInternalProps, KeyValueTableProps } from './KeyValueTable.types'

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

export const getKeyValueInitialRows = ({
    initialRows,
    placeholder,
}: Pick<KeyValueTableProps, 'initialRows' | 'placeholder'>): KeyValueTableInternalProps['rows'] =>
    initialRows.length
        ? initialRows.map(({ data: { key, value }, id }) => ({
              data: {
                  key: {
                      ...key,
                      type: DynamicDataTableRowDataType.TEXT,
                      props: { placeholder: placeholder.key },
                  },
                  value: {
                      ...value,
                      type: DynamicDataTableRowDataType.TEXT,
                      props: { placeholder: placeholder.value },
                  },
              },
              id,
          }))
        : [getEmptyRow(placeholder)]

export const getKeyValueInitialCellError = (
    rows: KeyValueTableInternalProps['rows'],
): KeyValueTableInternalProps['cellError'] =>
    rows.reduce((acc, curr) => {
        if (!acc[curr.id]) {
            acc[curr.id] = {
                key: { isValid: true, errorMessages: [] },
                value: { isValid: true, errorMessages: [] },
            }
        }

        return acc
    }, {})

export const getKeyValueHeaders = ({
    headerLabel,
    isSortable,
}: Pick<KeyValueTableProps, 'headerLabel' | 'isSortable'>): KeyValueTableInternalProps['headers'] => [
    { key: 'key', label: headerLabel.key, width: '30%', isSortable },
    { key: 'value', label: headerLabel.value, width: '1fr' },
]

export const getKeyValueTableKeysFrequency = (rows: KeyValueTableInternalProps['rows']) =>
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
