import Tippy from '@tippyjs/react'
import { useEffect, useState } from 'react'
import { ClipboardButton, GenericEmptyState, extractImage, getUserRole, showError } from '../../../Common'
import { EMPTY_STATE_STATUS } from './constants'
import { ReactComponent as DropDownIcon } from '../../../Assets/Icon/ic-chevron-down.svg'
import { GitChangesType, ScrollerType } from './types'
import GitCommitInfoGeneric from './GitCommitInfoGeneric'
import { CIListItem } from './Artifacts'

export const Scroller = ({ scrollToTop, scrollToBottom, style }: ScrollerType): JSX.Element => (
    <div style={style} className="dc__element-scroller flex column top">
        <Tippy className="default-tt" arrow={false} content="Scroll to Top">
            <button
                className="flex"
                disabled={!scrollToTop}
                type="button"
                onClick={scrollToTop}
                aria-label="dropdown-button"
            >
                <DropDownIcon className="rotate" style={{ ['--rotateBy' as any]: '180deg' }} />
            </button>
        </Tippy>
        <Tippy className="default-tt" arrow={false} content="Scroll to Bottom">
            <button
                className="flex"
                disabled={!scrollToBottom}
                type="button"
                onClick={scrollToBottom}
                aria-label="dropdown-button"
            >
                <DropDownIcon className="rotate" />
            </button>
        </Tippy>
    </div>
)

export const GitChanges = ({
    gitTriggers,
    ciMaterials,
    artifact,
    userApprovalMetadata,
    triggeredByEmail,
    ciPipelineId,
    artifactId,
    imageComment,
    imageReleaseTags,
    appReleaseTagNames,
    tagsEditable,
    hideImageTaggingHardDelete,
    appliedFilters,
    appliedFiltersTimestamp,
    promotionApprovalMetadata,
    selectedEnvironmentName,
    renderCIListHeader,
}: GitChangesType) => {
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
        if (artifactId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            initialise()
        }
    }, [artifactId])

    if (!ciMaterials?.length || !Object.keys(gitTriggers ?? {}).length) {
        return (
            <GenericEmptyState
                title={EMPTY_STATE_STATUS.DATA_NOT_AVAILABLE}
                subTitle={EMPTY_STATE_STATUS.DEVTRON_APP_DEPLOYMENT_HISTORY_SOURCE_CODE.SUBTITLE}
            />
        )
    }

    const extractImageArtifact = extractImage(artifact)

    return (
        <div className="flex column left w-100 ">
            {ciMaterials?.map((ciMaterial, index) => {
                const gitTrigger = gitTriggers[ciMaterial.id]
                return gitTrigger && (gitTrigger.Commit || gitTrigger.WebhookData?.data) ? (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`mat-${gitTrigger?.Commit}-${index}`}
                        className="bcn-0 pt-12 br-4 en-2 bw-1 pb-12 mt-16 ml-16"
                        data-testid="source-code-git-hash"
                        style={{ width: 'min( 100%, 800px )' }}
                    >
                        <GitCommitInfoGeneric
                            index={index}
                            materialUrl={gitTrigger?.GitRepoUrl ? gitTrigger.GitRepoUrl : ciMaterial?.url}
                            showMaterialInfoHeader
                            commitInfo={gitTrigger}
                            materialSourceType={
                                gitTrigger?.CiConfigureSourceType ? gitTrigger.CiConfigureSourceType : ciMaterial?.type
                            }
                            selectedCommitInfo=""
                            materialSourceValue={
                                gitTrigger?.CiConfigureSourceValue
                                    ? gitTrigger.CiConfigureSourceValue
                                    : ciMaterial?.value
                            }
                        />
                    </div>
                ) : null
            })}
            {artifact && (
                <div className="flex left column mt-16 mb-16 ml-16" style={{ width: 'min( 100%, 800px )' }}>
                    <CIListItem
                        type="deployed-artifact"
                        userApprovalMetadata={userApprovalMetadata}
                        triggeredBy={triggeredByEmail}
                        artifactId={artifactId}
                        ciPipelineId={ciPipelineId}
                        imageComment={imageComment}
                        imageReleaseTags={imageReleaseTags}
                        appReleaseTagNames={appReleaseTagNames}
                        tagsEditable={tagsEditable}
                        hideImageTaggingHardDelete={hideImageTaggingHardDelete}
                        appliedFilters={appliedFilters}
                        appliedFiltersTimestamp={appliedFiltersTimestamp}
                        isSuperAdmin={isSuperAdmin}
                        promotionApprovalMetadata={promotionApprovalMetadata}
                        selectedEnvironmentName={selectedEnvironmentName}
                        renderCIListHeader={renderCIListHeader}
                    >
                        <div className="flex column left hover-trigger">
                            <div className="cn-9 fs-14 flex left">
                                {extractImageArtifact}
                                <div className="pl-4">
                                    <ClipboardButton content={extractImageArtifact} />
                                </div>
                            </div>
                            <div className="cn-7 fs-12 flex left">
                                {artifact}
                                <div className="pl-4">
                                    <ClipboardButton content={artifact} />
                                </div>
                            </div>
                        </div>
                    </CIListItem>
                </div>
            )}
        </div>
    )
}
