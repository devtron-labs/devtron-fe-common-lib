import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {
    showError,
    GenericEmptyState,
    ImageTagsContainer,
    ClipboardButton,
    extractImage,
    getUserRole,
    DOCUMENTATION,
} from '../../../Common'
import { ReactComponent as Download } from '../../../Assets/Icon/ic-download.svg'
import { ReactComponent as MechanicalOperation } from '../../../Assets/Icon/ic-mechanical-operation.svg'
import { ReactComponent as OpenInNew } from '../../../Assets/Icon/ic-arrow-out.svg'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as Down } from '../../../Assets/Icon/ic-arrow-forward.svg'
import docker from '../../../Assets/Icon/ic-docker.svg'
import folder from '../../../Assets/Icon/ic-folder.svg'
import noartifact from '../../../Assets/Img/no-artifact@2x.png'
import { ArtifactType, CIListItemType, HistoryComponentType } from './types'
import { EMPTY_STATE_STATUS, TERMINAL_STATUS_MAP } from './constants'

const CIProgressView = (): JSX.Element => (
    <GenericEmptyState
        SvgImage={MechanicalOperation}
        title={EMPTY_STATE_STATUS.CI_PROGRESS_VIEW.TITLE}
        subTitle={EMPTY_STATE_STATUS.CI_PROGRESS_VIEW.SUBTITLE}
    />
)

export const CIListItem = ({
    type,
    userApprovalMetadata,
    triggeredBy,
    children,
    ciPipelineId,
    artifactId,
    imageComment,
    imageReleaseTags,
    appReleaseTagNames,
    tagsEditable,
    hideImageTaggingHardDelete,
    appliedFilters,
    isSuperAdmin,
    promotionApprovalMetadata,
    appliedFiltersTimestamp,
    selectedEnvironmentName,
    renderCIListHeader,
}: CIListItemType) => {
    const headerMetaDataPresent =
        !!userApprovalMetadata || !!appliedFilters?.length || !!promotionApprovalMetadata?.promotedFromType

    return (
        <>
            {type === 'deployed-artifact' && (
                <div className="flex mb-12 dc__width-inherit">
                    <div className="w-50 text-underline-dashed-300" />
                    <Down className="icon-dim-16 ml-8 mr-8" style={{ transform: 'rotate(90deg)' }} />
                    <div className="w-50 text-underline-dashed-300" />
                </div>
            )}

            {headerMetaDataPresent &&
                renderCIListHeader({
                    userApprovalMetadata,
                    triggeredBy,
                    appliedFilters,
                    appliedFiltersTimestamp,
                    promotionApprovalMetadata,
                    selectedEnvironmentName,
                })}

            <div
                className={`dc__h-fit-content ci-artifact ci-artifact--${type} image-tag-parent-card bcn-0 br-4 dc__border p-12 w-100 dc__mxw-800 ${
                    headerMetaDataPresent ? 'dc__no-top-radius dc__no-top-border' : ''
                }`}
                data-testid="hover-on-report-artifact"
            >
                <div className="ci-artifacts-grid flex left">
                    <div className="bcn-1 flex br-4 icon-dim-40">
                        <img src={type === 'report' ? folder : docker} className="icon-dim-20" alt="type" />
                    </div>
                    {children}
                </div>
                {type !== 'report' && (
                    <ImageTagsContainer
                        ciPipelineId={ciPipelineId}
                        artifactId={artifactId}
                        imageComment={imageComment}
                        imageReleaseTags={imageReleaseTags}
                        appReleaseTagNames={appReleaseTagNames}
                        tagsEditable={tagsEditable}
                        hideHardDelete={hideImageTaggingHardDelete}
                        isSuperAdmin={isSuperAdmin}
                    />
                )}
            </div>
        </>
    )
}

const Artifacts = ({
    status,
    artifact,
    blobStorageEnabled,
    isArtifactUploaded,
    getArtifactPromise,
    ciPipelineId,
    artifactId,
    isJobView,
    isJobCI,
    imageComment,
    imageReleaseTags,
    type,
    appReleaseTagNames,
    tagsEditable,
    hideImageTaggingHardDelete,
    jobCIClass,
    renderCIListHeader,
}: ArtifactType) => {
    const [isSuperAdmin, setSuperAdmin] = useState<boolean>(false)

    async function initialise() {
        try {
            const userRole = await getUserRole()

            const superAdmin = userRole?.result?.roles?.includes('role:super-admin___')
            setSuperAdmin(superAdmin)
        } catch (err) {
            showError(err)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        initialise()
    }, [])

    const { triggerId, buildId } = useParams<{
        triggerId: string
        buildId: string
    }>()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) {
            return
        }
        setTimeout(() => setCopied(false), 2000)
    }, [copied])

    async function handleArtifact() {
        try {
            const response = await getArtifactPromise()
            const b = await (response as any).blob()
            const a = document.createElement('a')
            a.href = URL.createObjectURL(b)
            a.download = `${buildId || triggerId}.zip`
            a.click()
        } catch (err) {
            showError(err)
        }
    }

    if (status.toLowerCase() === TERMINAL_STATUS_MAP.RUNNING || status.toLowerCase() === TERMINAL_STATUS_MAP.STARTING) {
        return <CIProgressView />
    }
    if (isJobView && !blobStorageEnabled) {
        return (
            <div className="flex column p-24 w-100 h-100">
                <GenericEmptyState
                    title={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoFilesFound}
                    subTitle={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.BlobStorageNotConfigured}
                    image={noartifact}
                />
                <div className="flexbox pt-8 pr-12 pb-8 pl-12 bcv-1 ev-2 bw-1 br-4 dc__position-abs-b-20">
                    <ICHelpOutline className="icon-dim-20 fcv-5" />
                    <span className="fs-13 fw-4 mr-8 ml-8">
                        {EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.StoreFiles}
                    </span>
                    <a
                        className="fs-13 fw-6 cb-5 dc__no-decor"
                        href={DOCUMENTATION.BLOB_STORAGE}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.ConfigureBlobStorage}
                    </a>
                    <OpenInNew className="icon-dim-20 ml-8" />
                </div>
            </div>
        )
    }
    if (isJobView && !isArtifactUploaded) {
        return (
            <GenericEmptyState
                title={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoFilesFound}
                subTitle={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoFilesGenerated}
                image={noartifact}
            />
        )
    }
    if (status.toLowerCase() === TERMINAL_STATUS_MAP.FAILED || status.toLowerCase() === TERMINAL_STATUS_MAP.CANCELLED) {
        if (isJobCI) {
            return (
                <GenericEmptyState
                    title={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.FailedToFetchArtifacts}
                    subTitle={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.FailedToFetchArtifactsError}
                />
            )
        }

        return (
            <GenericEmptyState
                title={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoArtifactsGenerated}
                subTitle={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoArtifactsError}
            />
        )
    }
    if (!artifactId && status.toLowerCase() === TERMINAL_STATUS_MAP.SUCCEEDED) {
        return (
            <GenericEmptyState
                title={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoArtifactsFound}
                subTitle={EMPTY_STATE_STATUS.ARTIFACTS_EMPTY_STATE_TEXTS.NoArtifactsFoundError}
                image={noartifact}
            />
        )
    }
    return (
        <div className={`flex left column p-16 ${jobCIClass ?? ''}`}>
            {!isJobView && type !== HistoryComponentType.CD && (
                <CIListItem
                    type="artifact"
                    ciPipelineId={ciPipelineId}
                    artifactId={artifactId}
                    imageComment={imageComment}
                    imageReleaseTags={imageReleaseTags}
                    appReleaseTagNames={appReleaseTagNames}
                    tagsEditable={tagsEditable}
                    hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                    isSuperAdmin={isSuperAdmin}
                    renderCIListHeader={renderCIListHeader}
                >
                    <div className="flex column left hover-trigger">
                        <div className="cn-9 fs-14 flex left" data-testid="artifact-text-visibility">
                            {extractImage(artifact)}
                            <div className="pl-4">
                                <ClipboardButton content={extractImage(artifact)} />
                            </div>
                        </div>
                        <div className="cn-7 fs-12 flex left" data-testid="artifact-image-text">
                            {artifact}
                            <div className="pl-4">
                                <ClipboardButton content={artifact} />
                            </div>
                        </div>
                    </div>
                </CIListItem>
            )}
            {blobStorageEnabled && getArtifactPromise && (type === HistoryComponentType.CD || isArtifactUploaded) && (
                <CIListItem
                    type="report"
                    hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                    isSuperAdmin={isSuperAdmin}
                    renderCIListHeader={renderCIListHeader}
                >
                    <div className="flex column left">
                        <div className="cn-9 fs-14">Reports.zip</div>
                        <button
                            type="button"
                            onClick={handleArtifact}
                            className="anchor p-0 cb-5 fs-12 flex left pointer"
                        >
                            Download
                            <Download className="ml-5 icon-dim-16" />
                        </button>
                    </div>
                </CIListItem>
            )}
        </div>
    )
}

export default Artifacts
