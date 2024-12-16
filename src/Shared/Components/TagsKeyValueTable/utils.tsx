import { PATTERNS } from '@Common/Constants'
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
            props: {
                placeholder: 'Enter value',
            },
        },
    },
    id: (Date.now() * Math.random()).toString(16),
    customState: {
        propagateTag: false,
    },
})

export const validateTagKeyValues = (value: string, key: string) => {
    if ((key === 'tagKey' || key === 'tagValue') && value) {
        const isValid = new RegExp(PATTERNS.ALPHANUMERIC_WITH_SPECIAL_CHAR).test(value)
        return {
            isValid,
            errorMessages: ['Can only contain alphanumeric chars and ( - ), ( _ ), ( . )', 'Spaces not allowed'],
        }
    }
    return { isValid: true, errorMessages: [] }
}
