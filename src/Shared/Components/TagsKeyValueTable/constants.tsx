import { DynamicDataTableHeaderType } from '../DynamicDataTable'
import { TagsTableColumnsType } from './types'

export const TAGS_TABLE_HEADERS: DynamicDataTableHeaderType<TagsTableColumnsType>[] = [
    {
        label: 'KEY',
        key: 'tagKey',
        width: '240px',
    },
    {
        label: 'VALUE',
        key: 'tagValue',
        width: '1fr',
    },
]

export const DEVTRON_AI_URL: string = 'devtron.ai/'
