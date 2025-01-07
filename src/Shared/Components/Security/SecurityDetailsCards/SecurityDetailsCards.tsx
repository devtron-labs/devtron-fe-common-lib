import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'
import { SCAN_TOOL_ID_CLAIR, SCAN_TOOL_ID_TRIVY } from '@Shared/constants'
import { useState } from 'react'
import SecurityCard from './SecurityCard'
import { CATEGORIES, SecurityModalStateType, SUB_CATEGORIES } from '../SecurityModal/types'
import { SecurityCardProps, SecurityDetailsCardsProps } from './types'
import { SecurityModal } from '../SecurityModal'
import { DEFAULT_SECURITY_MODAL_IMAGE_STATE } from '../SecurityModal/constants'

const SecurityDetailsCards = ({ scanResult, Sidebar }: SecurityDetailsCardsProps) => {
    const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
    const [modalState, setModalState] = useState<SecurityModalStateType>(DEFAULT_SECURITY_MODAL_IMAGE_STATE)
    const { imageScan, codeScan, kubernetesManifest } = scanResult

    const scanToolId =
        imageScan?.vulnerability?.list?.[0].scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR

    const handleCardClick = (
        category: SecurityCardProps['category'],
        subCategory: SecurityCardProps['subCategory'],
    ) => {
        setShowSecurityModal(true)
        setModalState({
            category,
            subCategory,
            detailViewData: null,
        })
    }

    const handleModalClose = () => {
        setShowSecurityModal(false)
    }

    return (
        <>
            <div className="flexbox-col dc__gap-20">
                {imageScan ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Image Scan</span>
                            <ScannedByToolModal scanToolId={scanToolId} />
                        </div>
                        <div className="flexbox dc__gap-12">
                            <SecurityCard
                                category={CATEGORIES.IMAGE_SCAN}
                                subCategory={SUB_CATEGORIES.VULNERABILITIES}
                                severityCount={imageScan.vulnerability?.summary?.severities}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.IMAGE_SCAN, SUB_CATEGORIES.VULNERABILITIES)
                                }
                            />
                            <SecurityCard
                                category={CATEGORIES.IMAGE_SCAN}
                                subCategory={SUB_CATEGORIES.LICENSE}
                                severityCount={imageScan.license?.summary?.severities}
                                handleCardClick={() => handleCardClick(CATEGORIES.IMAGE_SCAN, SUB_CATEGORIES.LICENSE)}
                            />
                        </div>
                    </div>
                ) : null}
                {codeScan ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Code Scan</span>
                            <ScannedByToolModal scanToolId={scanToolId} />
                        </div>
                        <div className="flexbox dc__gap-12">
                            <SecurityCard
                                category={CATEGORIES.CODE_SCAN}
                                subCategory={SUB_CATEGORIES.VULNERABILITIES}
                                severityCount={codeScan.vulnerability?.summary.severities}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.CODE_SCAN, SUB_CATEGORIES.VULNERABILITIES)
                                }
                            />
                            <SecurityCard
                                category={CATEGORIES.CODE_SCAN}
                                subCategory={SUB_CATEGORIES.LICENSE}
                                severityCount={codeScan.license?.summary?.severities}
                                handleCardClick={() => handleCardClick(CATEGORIES.CODE_SCAN, SUB_CATEGORIES.LICENSE)}
                            />
                        </div>
                        <div className="flexbox dc__gap-12">
                            <SecurityCard
                                category={CATEGORIES.CODE_SCAN}
                                subCategory={SUB_CATEGORIES.MISCONFIGURATIONS}
                                severityCount={codeScan.misConfigurations?.misConfSummary?.status}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.CODE_SCAN, SUB_CATEGORIES.MISCONFIGURATIONS)
                                }
                            />
                            <SecurityCard
                                category={CATEGORIES.CODE_SCAN}
                                subCategory={SUB_CATEGORIES.EXPOSED_SECRETS}
                                severityCount={codeScan.exposedSecrets?.summary?.severities}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.CODE_SCAN, SUB_CATEGORIES.EXPOSED_SECRETS)
                                }
                            />
                        </div>
                    </div>
                ) : null}
                {kubernetesManifest ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Manifest Scan</span>
                            <ScannedByToolModal scanToolId={scanToolId} />
                        </div>
                        <div className="flexbox dc__gap-12">
                            <SecurityCard
                                category={CATEGORIES.KUBERNETES_MANIFEST}
                                subCategory={SUB_CATEGORIES.MISCONFIGURATIONS}
                                severityCount={kubernetesManifest.misConfigurations?.misConfSummary?.status}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.KUBERNETES_MANIFEST, SUB_CATEGORIES.MISCONFIGURATIONS)
                                }
                            />
                            <SecurityCard
                                category={CATEGORIES.KUBERNETES_MANIFEST}
                                subCategory={SUB_CATEGORIES.EXPOSED_SECRETS}
                                severityCount={kubernetesManifest.exposedSecrets?.summary?.severities}
                                handleCardClick={() =>
                                    handleCardClick(CATEGORIES.KUBERNETES_MANIFEST, SUB_CATEGORIES.EXPOSED_SECRETS)
                                }
                            />
                        </div>
                    </div>
                ) : null}
            </div>
            {showSecurityModal && (
                <SecurityModal
                    isLoading={false}
                    error={null}
                    responseData={scanResult}
                    handleModalClose={handleModalClose}
                    Sidebar={Sidebar}
                    defaultState={modalState}
                />
            )}
        </>
    )
}

export default SecurityDetailsCards
