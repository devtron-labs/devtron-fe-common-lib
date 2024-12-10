import { DynamicDataTableRowDataType, DynamicDataTableRowType } from '../DynamicDataTable'
import { TagsTableColumnsType } from './types'

export const getEmptyTagTableRow = (): DynamicDataTableRowType<TagsTableColumnsType> => ({
    data: {
        tagKey: {
            value: '',
            type: DynamicDataTableRowDataType.TEXT,
            props: {
                placeholder: 'Eg. owner-name',
            },
        },
        tagValue: {
            value: '',
            type: DynamicDataTableRowDataType.TEXT,
            props: {},
        },
    },
    id: (Date.now() * Math.random()).toString(16),
    customState: {
        propagateTag: false,
    },
})
