import { ReactComponent as ICPropagate } from '@Icons/inject-tag.svg'
import { PropagateTagInfo } from '@Common/CustomTagSelector'
import { Tooltip } from '@Common/Tooltip'
import { TagsContainerProps, TagsTableColumnsType } from './types'
import { DEVTRON_AI_URL, TAGS_TABLE_HEADERS } from './constants'
import { DynamicDataTable, DynamicDataTableRowType } from '../DynamicDataTable'
import { getEmptyTagTableRow, validateTagKeyValues } from './utils'

const TagsKeyValueTable = ({
    rows,
    setRows,
    hidePropagateTags,
    getEmptyRow = getEmptyTagTableRow,
    onRowEdit,
    tagsError,
    setTagErrors,
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
        const isPropagationDisabled: boolean = (row.customState?.disablePropagateButton as boolean) || false
        return (
            <Tooltip content="Propagate tags to K8s resources" alwaysShowTippyOnHover>
                <button
                    onClick={() => handlePropagateTag(row.id)}
                    className={`pointer flexbox dc__content-center dc__align-start pt-8 h-100 w-100 ${propagateTag ? 'bcn-7' : ''} ${
                        row.data.tagKey.value.startsWith(DEVTRON_AI_URL) || isPropagationDisabled
                            ? 'cursor-not-allowed bcn-1'
                            : ''
                    } dc__transparent dc__tab-focus`}
                    data-index={row.id}
                    type="button"
                    disabled={isPropagationDisabled}
                >
                    <ICPropagate className={`icon-dim-20 ${propagateTag ? 'scn-0' : ''}`} />
                </button>
            </Tooltip>
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
        const updatedTagsError = structuredClone(tagsError)

        if (!updatedTagsError[updatedRow.id]) {
            updatedTagsError[updatedRow.id] = {
                tagKey: { isValid: true, errorMessages: [] },
                tagValue: { isValid: true, errorMessages: [] },
            }
        }
        updatedTagsError[updatedRow.id][headerKey] = validateTagKeyValues(value, headerKey)

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
                    customState: {
                        ...row.customState,
                    },
                }
            }

            return row
        })

        setRows(updatedRows)
        setTagErrors(updatedTagsError)
    }

    const dataTableHandleDelete = (row: DynamicDataTableRowType<TagsTableColumnsType>) => {
        const remainingRows = rows.filter(({ id }) => id !== row.id)

        if (remainingRows.length === 0) {
            setRows([getEmptyRow()])
            return
        }
        setRows(remainingRows)
    }

    return (
        <DynamicDataTable
            headers={TAGS_TABLE_HEADERS}
            rows={rows}
            onRowEdit={onRowEdit ?? dataTableHandleChange}
            onRowDelete={dataTableHandleDelete}
            onRowAdd={dataTableHandleAddition}
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
            cellError={tagsError}
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
