import { ReactComponent as ICPropagate } from '@Icons/inject-tag.svg'
import { PATTERNS } from '@Common/Constants'
import { PropagateTagInfo } from '@Common/CustomTagSelector'
import { TagsContainerProps, TagsTableColumnsType } from './types'
import { DEVTRON_AI_URL, TAGS_TABLE_HEADERS } from './constants'
import { DynamicDataTable, DynamicDataTableRowType } from '../DynamicDataTable'
import { getEmptyTagTableRow } from './utils'

const TagsKeyValueTable = ({
    rows,
    setRows,
    hidePropagateTags,
    getEmptyRow = getEmptyTagTableRow,
    onRowEdit,
}: TagsContainerProps) => {
    const handlePropagateTag = (rowId: string | number) => {
        const updatedRows = rows.map<DynamicDataTableRowType<TagsTableColumnsType>>((row) => {
            if (row.id === rowId) {
                return {
                    ...row,
                    customState: {
                        propagateTag: !row.customState.propagateTag,
                    },
                }
            }
            return row
        })
        setRows(updatedRows)
    }

    const propagateTagButton = (row: DynamicDataTableRowType<TagsTableColumnsType>) => {
        const propagateTag: boolean = (row.customState?.propagateTag as boolean) || false
        return (
            <button
                onClick={() => handlePropagateTag(row.id)}
                className={`pointer flex h-100 w-100 ${propagateTag ? 'bcn-7' : ''} ${
                    row.data.tagKey.value.startsWith(DEVTRON_AI_URL) ? 'cursor-not-allowed bcn-1' : ''
                } dc__transparent dc__tab-focus`}
                data-index={row.id}
                type="button"
            >
                <ICPropagate className={`icon-dim-20 ${propagateTag ? 'scn-0' : ''}`} />
            </button>
        )
    }

    const dataTableHandleAddition = () => {
        const newEmptyRow = getEmptyRow()
        const editedRows = [...rows, newEmptyRow]
        setRows(editedRows)
    }

    const dataTableHandleChange = (
        updatedRow: DynamicDataTableRowType<TagsTableColumnsType>,
        headerKey: string,
        value: string,
    ) => {
        const updatedRows = rows.map<DynamicDataTableRowType<TagsTableColumnsType>>((row) => {
            if (row.id === updatedRow.id) {
                return {
                    ...row,
                    data: {
                        ...row.data,
                        [headerKey]: {
                            ...row.data[headerKey],
                            value,
                        },
                    },
                }
            }

            return row
        })

        setRows(updatedRows)
    }

    const dataTableHandleDelete = (row: DynamicDataTableRowType<TagsTableColumnsType>) => {
        const remainingRows = rows.filter(({ id }) => id !== row.id)

        if (remainingRows.length === 0) {
            setRows([getEmptyRow()])
            return
        }
        setRows(remainingRows)
    }

    const validateTagKeyValues = (value: string, key: TagsTableColumnsType) => {
        if ((key === 'tagKey' || value === 'tagValue') && value) {
            const isValid = new RegExp(PATTERNS.ALPHANUMERIC_WITH_SPECIAL_CHAR).test(value)
            return {
                isValid,
                errorMessages: ['Can only contain alphanumeric chars and ( - ), ( _ ), ( . )', 'Spaces not allowed'],
            }
        }
        return { isValid: true, errorMessages: [] }
    }

    return (
        <DynamicDataTable
            headers={TAGS_TABLE_HEADERS}
            rows={rows}
            onRowEdit={onRowEdit ?? dataTableHandleChange}
            onRowDelete={dataTableHandleDelete}
            onRowAdd={dataTableHandleAddition}
            showError
            validationSchema={validateTagKeyValues}
            {...(!hidePropagateTags
                ? {
                      actionButtonConfig: {
                          renderer: propagateTagButton,
                          key: 'tagKey',
                          width: '32px',
                          position: 'start',
                      },
                  }
                : {})}
        />
    )
}

const TagsContainer = ({ isCreateApp = false, hidePropagateTags = false, ...props }: TagsContainerProps) => (
    <div className="flexbox-col dc__gap-8">
        <div className="flexbox dc__content-space">
            <span className="cn-7 fs-13 fw-4 lh-20">Tags</span>
            {!hidePropagateTags && <PropagateTagInfo isCreateApp={isCreateApp} />}
        </div>
        <TagsKeyValueTable hidePropagateTags={hidePropagateTags} {...props} />
    </div>
)

export default TagsContainer
