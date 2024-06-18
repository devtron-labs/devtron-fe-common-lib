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

import { Drawer, GenericEmptyState, useAsync } from '../../../Common'
import { getArtifactInfo, getCITriggerInfo } from '../../Services/app.service'
import { APIResponseHandler } from '../APIResponseHandler'
import { ReactComponent as ICClose } from '../../../Assets/Icon/ic-close.svg'
import { ReactComponent as ICArrowDown } from '../../../Assets/Icon/ic-arrow-down.svg'
import { Artifacts, HistoryComponentType } from '../CICDHistory'
import MaterialHistory from '../MaterialHistory/MaterialHistory.component'
import { ArtifactInfoModalProps } from './types'

const ArtifactInfoModal = ({
    envId,
    ciArtifactId,
    handleClose,
    renderCIListHeader,
    fetchOnlyArtifactInfo = false,
}: ArtifactInfoModalProps) => {
    const [isInfoLoading, artifactInfo, infoError, refetchArtifactInfo] = useAsync(
        () =>
            fetchOnlyArtifactInfo
                ? getArtifactInfo({
                      ciArtifactId,
                  })
                : getCITriggerInfo({
                      ciArtifactId,
                      envId,
                  }),
        [ciArtifactId, envId, fetchOnlyArtifactInfo],
    )

    const isArtifactInfoAvailable = !!artifactInfo?.materials?.length
    const showDescription = isArtifactInfoAvailable && !fetchOnlyArtifactInfo

    return (
        <Drawer position="right" width="800px" onEscape={handleClose}>
            <div data-testid="visible-modal-commit-info" className="h-100vh">
                <div className="flex dc__content-space py-10 px-20 cn-9 bcn-0 dc__border-bottom">
                    <div className="flexbox-col dc__content-center">
                        {isInfoLoading ? (
                            <>
                                <div className="shimmer h-24 mb-2 w-200" />
                                <div className="shimmer h-18 w-250" />
                            </>
                        ) : (
                            <>
                                <h1 className="fs-16 fw-6 lh-24 m-0 dc__truncate">
                                    {showDescription
                                        ? artifactInfo?.appName
                                        : `Source & image details of ${artifactInfo?.appName}`}
                                </h1>
                                {showDescription && (
                                    <p className="fs-13 cn-7 lh-1-5 m-0 dc__truncate">
                                        Deployed on {artifactInfo.environmentName} at {artifactInfo.lastDeployedTime}
                                        &nbsp;by {artifactInfo.triggeredByEmail}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <button
                        data-testid="visible-modal-close"
                        type="button"
                        className="dc__transparent flex"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <ICClose className="icon-dim-24 icon-use-fill-n6" />
                    </button>
                </div>
                <div className="m-lr-0 flexbox trigger-modal-body-height dc__overflow-scroll pb-12 dc__window-bg">
                    <APIResponseHandler
                        isLoading={isInfoLoading}
                        progressingProps={{
                            pageLoader: true,
                        }}
                        error={infoError}
                        errorScreenManagerProps={{
                            code: infoError?.code,
                            reload: refetchArtifactInfo,
                        }}
                    >
                        {isArtifactInfoAvailable ? (
                            <div className="select-material">
                                {artifactInfo.materials.map((material) => (
                                    <MaterialHistory material={material} pipelineName="" key={material.id} />
                                ))}
                                <div className="dc__dashed_icon_grid-container">
                                    <hr className="dc__dotted-line" />
                                    <div className="flex">
                                        <ICArrowDown className="scn-6" />
                                    </div>
                                    <hr className="dc__dotted-line" />
                                </div>
                                <Artifacts
                                    status=""
                                    artifact={artifactInfo.image}
                                    blobStorageEnabled
                                    isArtifactUploaded={false}
                                    isJobView={false}
                                    type={HistoryComponentType.CI}
                                    imageReleaseTags={artifactInfo.imageReleaseTags}
                                    imageComment={artifactInfo.imageComment}
                                    // FIXME: This is a existing issue, we should be sending the pipeline if instead of the artifact if
                                    ciPipelineId={artifactInfo.materials[0].id}
                                    artifactId={ciArtifactId}
                                    appReleaseTagNames={artifactInfo.appReleaseTags}
                                    tagsEditable={artifactInfo.tagsEditable}
                                    hideImageTaggingHardDelete={false}
                                    renderCIListHeader={renderCIListHeader}
                                />
                            </div>
                        ) : (
                            <GenericEmptyState
                                title="Data not available"
                                subTitle="The data you are looking for is not available"
                                classname="h-100 bcn-0"
                            />
                        )}
                    </APIResponseHandler>
                </div>
            </div>
        </Drawer>
    )
}

export default ArtifactInfoModal
