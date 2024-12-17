import { DynamicDataTableCellErrorType, DynamicDataTableProps, DynamicDataTableRowType } from '../DynamicDataTable'

export type TagsTableColumnsType = 'tagKey' | 'tagValue'

export interface TagsContainerProps extends Partial<Pick<DynamicDataTableProps<TagsTableColumnsType>, 'onRowEdit'>> {
    isCreateApp?: boolean
    rows: DynamicDataTableRowType<TagsTableColumnsType>[]
    setRows: (updatedRows: DynamicDataTableRowType<TagsTableColumnsType>[]) => void
    hidePropagateTags?: boolean
    getEmptyRow?: (keyChoices?: string[]) => DynamicDataTableRowType<TagsTableColumnsType>
    tagsError: DynamicDataTableCellErrorType<TagsTableColumnsType>
    setTagErrors: (updatedTagsError: DynamicDataTableCellErrorType<TagsTableColumnsType>) => void
}
