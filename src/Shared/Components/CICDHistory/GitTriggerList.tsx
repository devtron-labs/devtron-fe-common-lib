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

import { memo } from 'react'
import { ReactComponent as ICBranch } from '@Icons/ic-branch.svg'
import { GitTriggers } from '@Shared/types'
import { createGitCommitUrl, SourceTypeMap } from '@Common/Common.service'
import { getHandleOpenURL, renderMaterialIcon } from '@Shared/Helpers'
import { DeploymentSummaryTooltipCardType } from './types'
import { CiPipelineSourceConfig } from './CiPipelineSourceConfig'
import { CommitChipCell } from '../CommitChipCell'

const GitTriggerList = memo(
    ({
        ciMaterials,
        gitTriggers,
        addMarginTop,
    }: Pick<DeploymentSummaryTooltipCardType, 'ciMaterials' | 'gitTriggers'> & {
        addMarginTop?: boolean
    }): JSX.Element => (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {Object.keys(gitTriggers ?? {}).length > 0 &&
                ciMaterials?.map((ciMaterial) => {
                    const gitDetail: GitTriggers = gitTriggers[ciMaterial.id]

                    const sourceType = gitDetail?.CiConfigureSourceType || ciMaterial?.type
                    const sourceValue = gitDetail?.CiConfigureSourceValue || ciMaterial?.value
                    const gitMaterialUrl = gitDetail?.GitRepoUrl || ciMaterial?.url

                    if (sourceType !== SourceTypeMap.WEBHOOK && !gitDetail) {
                        return null
                    }

                    return (
                        <div className={`${addMarginTop ? 'mt-16' : ''}`} key={ciMaterial.id}>
                            {sourceType === SourceTypeMap.WEBHOOK ? (
                                <div className="flex left column">
                                    <CiPipelineSourceConfig
                                        sourceType={sourceType}
                                        sourceValue={sourceValue}
                                        showTooltip={false}
                                    />
                                </div>
                            ) : (
                                <div className="flexbox-col dc__gap-4">
                                    <div className="flexbox dc__gap-6 dc__align-start">
                                        {renderMaterialIcon(gitMaterialUrl)}

                                        {gitDetail?.GitRepoName && (
                                            <span className="cn-9 fs-13 fw-6 lh-20 dc__word-break">
                                                {gitDetail.GitRepoName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flexbox dc__gap-6 dc__align-start">
                                        <ICBranch className="icon-dim-20 p-2 dc__no-shrink fcn-7" />
                                        <span className="cn-7 dc__word-break fs-13 fw-4 lh-16">{sourceValue}</span>
                                    </div>

                                    {gitDetail?.Commit && (
                                        <CommitChipCell
                                            commits={[gitDetail.Commit]}
                                            handleClick={getHandleOpenURL(
                                                createGitCommitUrl(ciMaterial.url, gitDetail.Commit),
                                            )}
                                        />
                                    )}

                                    {gitDetail?.Message && (
                                        <p className="m-0 cn-9 fs-13 fw-4 lh-20 dc__truncate--clamp-3">
                                            {gitDetail.Message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
        </>
    ),
)

export default GitTriggerList
