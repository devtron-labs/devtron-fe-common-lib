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

import Tippy from '@tippyjs/react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ClipboardButton, GenericEmptyState, extractImage, useKeyDown, useSuperAdmin } from '../../../Common'
import { EMPTY_STATE_STATUS } from '../../constants'
import { ReactComponent as DropDownIcon } from '../../../Assets/Icon/ic-chevron-down.svg'
import { GitChangesType, LogResizeButtonType, ScrollerType } from './types'
import GitCommitInfoGeneric from '../GitCommitInfoGeneric/GitCommitInfoGeneric'
import { CIListItem } from './Artifacts'
import { ReactComponent as ZoomIn } from '../../../Assets/Icon/ic-fullscreen.svg'
import { ReactComponent as ZoomOut } from '../../../Assets/Icon/ic-exit-fullscreen.svg'
import './cicdHistory.scss'

export const LogResizeButton = ({ fullScreenView, setFullScreenView }: LogResizeButtonType): JSX.Element => {
    const { pathname } = useLocation()

    const keys = useKeyDown()

    const toggleFullScreen = (): void => {
        setFullScreenView(!fullScreenView)
    }

    useEffect(() => {
        if (!pathname.includes('/logs')) {
            return
        }
        // eslint-disable-next-line default-case
        switch (keys.join('')) {
            case 'f':
                toggleFullScreen()
                break
            case 'Escape':
                setFullScreenView(false)
                break
        }
    }, [keys])

    return (
        pathname.includes('/logs') && (
            <Tippy
                placement="top"
                arrow={false}
                className="default-tt"
                content={fullScreenView ? 'Exit fullscreen (f)' : 'Enter fullscreen (f)'}
            >
                <div>
                    {fullScreenView ? (
                        <ZoomOut className="zoom zoom--out pointer dc__zi-4" onClick={toggleFullScreen} />
                    ) : (
                        <ZoomIn className="zoom zoom--in pointer dc__zi-4" onClick={toggleFullScreen} />
                    )}
                </div>
            </Tippy>
        )
    )
}

export const Scroller = ({ scrollToTop, scrollToBottom, style }: ScrollerType): JSX.Element => (
    <div style={style} className="dc__element-scroller flex column top br-4">
        <Tippy className="default-tt" arrow={false} content="Scroll to Top">
            <button
                className="flex"
                disabled={!scrollToTop}
                type="button"
                onClick={scrollToTop}
                aria-label="scroll-to-top"
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
                aria-label="scroll-to-button"
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
    const { isSuperAdmin } = useSuperAdmin()

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
        <div className="history-component__wrapper flex column left w-100 p-16 dc__gap-12">
            {ciMaterials?.map((ciMaterial, index) => {
                const gitTrigger = gitTriggers[ciMaterial.id]
                return gitTrigger && (gitTrigger.Commit || gitTrigger.WebhookData?.data) ? (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`mat-${gitTrigger?.Commit}-${index}`}
                        className="bcn-0 br-4 en-2 bw-1"
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
                <div className="history-component__artifact flex left column dc__gap-12">
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
