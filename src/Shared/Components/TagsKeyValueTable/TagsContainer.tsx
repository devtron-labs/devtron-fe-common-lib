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

import ReactGA from 'react-ga4'

import { ReactComponent as ICPropagate } from '@Icons/inject-tag.svg'
import { PropagateTagInfo, validateTagKeyValue } from '@Common/CustomTagSelector'
import { validateTagValue } from '@Common/CustomTagSelector/tags.utils'
import { Tooltip } from '@Common/Tooltip'

import { DynamicDataTable, DynamicDataTableRowType } from '../DynamicDataTable'
import { DEVTRON_AI_URL, TAGS_TABLE_HEADERS } from './constants'
import { TagsContainerProps, TagsTableColumnsType } from './types'
import { getEmptyTagTableRow } from './utils'

const TagsKeyValueTable = ({
    appType,
    rows,
    setRows,
    hidePropagateTags,
    getEmptyRow = getEmptyTagTableRow,
    onRowEdit,
    tagsError,
    setTagErrors,
}: TagsContainerProps) => {
    const handlePropagateTag = (rowId: string | number) => {
        ReactGA.event({
            category: 'Tags',
            action: `${appType.toUpperCase()}_PROPAGATE_TAG_BUTTON_CLICKED`,
        })
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
        const isPropagationDisabled: boolean =
            (row.customState?.disablePropagateButton as boolean) ||
            row.data.tagKey.value.startsWith(DEVTRON_AI_URL) ||
            false
        return (
            <Tooltip content="Propagate tags to K8s resources" alwaysShowTippyOnHover>
                <button
                    onClick={() => handlePropagateTag(row.id)}
                    className={`pointer flexbox dc__content-center dc__align-start pt-8 h-100 w-100 ${propagateTag ? 'bcn-7' : ''} ${isPropagationDisabled ? 'cursor-not-allowed' : ''} dc__transparent dc__tab-focus`}
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
        ReactGA.event({
            category: 'Tags',
            action: `${appType.toUpperCase()}_ADD_TAG_BUTTON_CLICKED`,
        })
        const newEmptyRow = getEmptyRow()
        const editedRows = [newEmptyRow, ...rows]
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
        if (headerKey === 'tagKey') {
            updatedTagsError[updatedRow.id].tagKey = validateTagKeyValue(value)
        } else {
            updatedTagsError[updatedRow.id].tagValue = validateTagValue(value, updatedRow.data.tagKey.value)
        }

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
                        propagateTag:
                            headerKey === 'tagKey' && value === DEVTRON_AI_URL ? false : row.customState.propagateTag,
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
