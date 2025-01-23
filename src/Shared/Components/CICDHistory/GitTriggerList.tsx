import { memo } from 'react'
import { ReactComponent as ICBranch } from '@Icons/ic-branch.svg'
import { GitTriggers } from '@Shared/types'
import { createGitCommitUrl, SourceTypeMap } from '@Common/Common.service'
import { getHandleOpenURL, renderMaterialIcon } from '@Shared/Helpers'
import { Tooltip } from '@Common/Tooltip'
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
                    const sourceType = gitDetail?.CiConfigureSourceType
                        ? gitDetail.CiConfigureSourceType
                        : ciMaterial?.type
                    const sourceValue = gitDetail?.CiConfigureSourceValue
                        ? gitDetail.CiConfigureSourceValue
                        : ciMaterial?.value
                    const gitMaterialUrl = gitDetail?.GitRepoUrl ? gitDetail.GitRepoUrl : ciMaterial?.url
                    if (sourceType !== SourceTypeMap.WEBHOOK && !gitDetail) {
                        return null
                    }

                    return (
                        <div className={`${addMarginTop ? 'mt-22' : ''} ci-material-detail"`} key={ciMaterial.id}>
                            {sourceType === SourceTypeMap.WEBHOOK ? (
                                <div className="flex left column">
                                    <CiPipelineSourceConfig
                                        sourceType={sourceType}
                                        sourceValue={sourceValue}
                                        showTooltip={false}
                                    />
                                </div>
                            ) : (
                                <div className="flexbox-col dc__gap-8">
                                    <div className="flexbox dc__gap-4 dc__align-start">
                                        {renderMaterialIcon(gitMaterialUrl)}

                                        {gitDetail?.GitRepoName && (
                                            <>
                                                <Tooltip content={gitDetail.GitRepoName}>
                                                    <span className="cn-9 fs-13 fw-6 lh-20">
                                                        {gitDetail.GitRepoName}
                                                    </span>
                                                </Tooltip>

                                                <span className="cn-5 fs-13 fw-4 lh-20 dc__no-shrink">/</span>
                                            </>
                                        )}

                                        <a
                                            href={createGitCommitUrl(gitMaterialUrl, gitDetail?.Commit)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="anchor flexbox dc__gap-2 dc__align-items-center"
                                        >
                                            <ICBranch className="icon-dim-12 dc__no-shrink fcn-7" />
                                            {sourceValue}
                                        </a>
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
                                        <Tooltip content={gitDetail.Message}>
                                            <p className="m-0 cn-9 fs-13 fw-4 lh-20 dc__truncate--clamp-3">
                                                {gitDetail.Message}
                                            </p>
                                        </Tooltip>
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
