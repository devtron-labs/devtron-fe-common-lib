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

import { getWebhookDate } from '@Shared/Helpers'
import { MaterialHistoryType } from '@Shared/Services'
import { useMemo } from 'react'
import { SourceTypeMap } from '../../../Common'
import { GitCommitInfoGeneric } from '../GitCommitInfoGeneric'
import { MaterialHistoryProps } from './types'

const MaterialHistory = ({
    material,
    pipelineName,
    ciPipelineId,
    selectCommit,
    isCommitInfoModal,
}: MaterialHistoryProps) => {
    const onClickMaterialHistory = (e, _commitId, isExcluded) => {
        e.stopPropagation()
        if (selectCommit && !isExcluded) {
            selectCommit(material.id.toString(), _commitId, ciPipelineId)
        }
    }

    const materialHistoryMapWithTime = useMemo(
        () =>
            material.history.reduce<Record<string, MaterialHistoryType[]>>((acc, historyElem: MaterialHistoryType) => {
                const isWebhook = material.type === SourceTypeMap.WEBHOOK
                const newDate = isWebhook
                    ? getWebhookDate(material.type, historyElem).substring(0, 16)
                    : historyElem.date.substring(0, 16)
                if (!acc[newDate]) {
                    acc[newDate] = []
                }
                acc[newDate].push(historyElem)
                return acc
            }, {}),
        [material.history, material.type],
    )

    // Retrieve the history map
    // Retrieve the keys of the history map
    const dateKeys = Object.keys(materialHistoryMapWithTime)

    return (
        // added for consistent typing
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {dateKeys.map((date) => {
                const historyList = materialHistoryMapWithTime[date]
                return (
                    <div key={date} className="flexbox-col dc__gap-12 py-12 px-16">
                        {!isCommitInfoModal && (
                            <div className="flex left dc__gap-8">
                                <span className="fs-12 lh-18 cn-7 fw-6 w-130">{date}</span>
                                <div className="h-1 bcn-2 w-100" />
                            </div>
                        )}

                        {historyList?.map((history, index) => {
                            const _commitId =
                                material.type === SourceTypeMap.WEBHOOK && history.webhookData
                                    ? history.webhookData.id.toString()
                                    : history.commit

                            return (
                                <div
                                    data-testid={`material-history-${index}`}
                                    key={_commitId}
                                    className={`material-history w-auto ${!history.excluded && !isCommitInfoModal ? 'cursor material-history__box-shadow' : ''} ${history.isSelected ? 'material-history-selected' : ''}`}
                                    onClick={(e) => onClickMaterialHistory(e, _commitId, history.excluded)}
                                >
                                    <GitCommitInfoGeneric
                                        index={index}
                                        materialUrl={material.gitURL}
                                        showMaterialInfoHeader={pipelineName === ''}
                                        commitInfo={history}
                                        materialSourceType={material.type}
                                        selectedCommitInfo={selectCommit}
                                        materialSourceValue={material.value}
                                        isExcluded={history.excluded}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </>
    )
}
export default MaterialHistory
