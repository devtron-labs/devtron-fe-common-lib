import { Drawer, GenericEmptyState, useAsync } from '../../../Common'
import { getCITriggerInfo } from '../../Services/app.service'
import { APIResponseHandler } from '../APIResponseHandler'
import { ReactComponent as ICClose } from '../../../Assets/Icon/ic-close.svg'
import { ReactComponent as ICArrowDown } from '../../../Assets/Icon/ic-arrow-down.svg'
import { Artifacts, HistoryComponentType } from '../CICDHistory'
import MaterialHistory from '../MaterialHistory/MaterialHistory.component'
import { ArtifactInfoModalProps } from './types'

const ArtifactInfoModal = ({ envId, ciArtifactId, handleClose, renderCIListHeader }: ArtifactInfoModalProps) => {
    const [isInfoLoading, artifactInfo, infoError, refetchArtifactInfo] = useAsync(() =>
        getCITriggerInfo({
            ciArtifactId,
            envId,
        }),
    )

    const isArtifactInfoAvailable = !!artifactInfo?.materials?.length

    return (
        <Drawer position="right" width="800px" onEscape={handleClose}>
            <div data-testid="visible-modal-commit-info" className="h-100vh">
                <div className="trigger-modal__header bcn-0">
                    <div>
                        {isInfoLoading ? (
                            <div />
                        ) : (
                            <>
                                <h1 className="modal__title">{artifactInfo?.appName}</h1>
                                {isArtifactInfoAvailable && (
                                    <p className="fs-13 cn-7 lh-1-54 m-0">
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
                        className="dc__transparent"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <ICClose className="icon-dim-24 icon-use-fill-n6" />
                    </button>
                </div>
                <APIResponseHandler
                    isLoading={isInfoLoading}
                    error={infoError}
                    errorScreenManagerProps={{
                        code: infoError?.code,
                        reload: refetchArtifactInfo,
                    }}
                >
                    {isArtifactInfoAvailable ? (
                        <div className="m-lr-0 flexbox trigger-modal-body-height dc__overflow-scroll pb-12">
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
        </Drawer>
    )
}

export default ArtifactInfoModal
