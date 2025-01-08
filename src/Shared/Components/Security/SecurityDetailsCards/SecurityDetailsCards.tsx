import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'
import { SCAN_TOOL_ID_CLAIR, SCAN_TOOL_ID_TRIVY } from '@Shared/constants'
import { useState } from 'react'
import SecurityCard from './SecurityCard'
import { CATEGORIES, SecurityModalStateType, SUB_CATEGORIES } from '../SecurityModal/types'
import { SecurityCardProps, SecurityDetailsCardsProps } from './types'
import { SecurityModal } from '../SecurityModal'
import { DEFAULT_SECURITY_MODAL_IMAGE_STATE } from '../SecurityModal/constants'
import { ScanSubCategories } from '../types'
import './securityCard.scss'

const SecurityDetailsCards = ({ scanResult, Sidebar }: SecurityDetailsCardsProps) => {
    const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
    const [modalState, setModalState] = useState<SecurityModalStateType>(DEFAULT_SECURITY_MODAL_IMAGE_STATE)
    const { imageScan, codeScan, kubernetesManifest } = scanResult

    const imageScanToolId =
        imageScan?.vulnerability?.list?.[0].scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR
    const codeScanToolId = codeScan?.scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR
    const manifestScanToolId = kubernetesManifest?.scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR

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

    const isValidSubCategory = (subCategory: ScanSubCategories): boolean =>
        Object.values(SUB_CATEGORIES).includes(subCategory)

    return (
        <>
            <div className="flexbox-col dc__gap-20">
                {imageScan ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Image Scan</span>
                            <ScannedByToolModal scanToolId={imageScanToolId} />
                        </div>
                        <div className="dc__grid security-cards">
                            {Object.keys(imageScan).map((subCategory: SecurityCardProps['subCategory']) => {
                                if (!isValidSubCategory(subCategory)) {
                                    return null
                                }
                                return (
                                    <SecurityCard
                                        category={CATEGORIES.IMAGE_SCAN}
                                        subCategory={subCategory}
                                        severityCount={imageScan[subCategory]?.summary.severities}
                                        handleCardClick={() => handleCardClick(CATEGORIES.IMAGE_SCAN, subCategory)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : null}
                {codeScan ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Code Scan</span>
                            <ScannedByToolModal scanToolId={codeScanToolId} />
                        </div>
                        <div className="dc__grid security-cards">
                            {Object.keys(codeScan).map((subCategory: SecurityCardProps['subCategory']) => {
                                if (!isValidSubCategory(subCategory)) {
                                    return null
                                }
                                const severityCount =
                                    subCategory === 'misConfigurations'
                                        ? codeScan.misConfigurations?.misConfSummary?.status
                                        : codeScan[subCategory]?.summary?.severities
                                return (
                                    <SecurityCard
                                        category={CATEGORIES.CODE_SCAN}
                                        subCategory={subCategory}
                                        severityCount={severityCount}
                                        handleCardClick={() => handleCardClick(CATEGORIES.CODE_SCAN, subCategory)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : null}
                {kubernetesManifest ? (
                    <div className="flexbox-col dc__gap-12">
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">Manifest Scan</span>
                            <ScannedByToolModal scanToolId={manifestScanToolId} />
                        </div>
                        <div className="dc__grid security-cards">
                            {Object.keys(kubernetesManifest).map((subCategory: SecurityCardProps['subCategory']) => {
                                if (!isValidSubCategory(subCategory)) {
                                    return null
                                }
                                const severityCount =
                                    subCategory === 'misConfigurations'
                                        ? kubernetesManifest.misConfigurations?.misConfSummary?.status
                                        : kubernetesManifest[subCategory]?.summary?.severities
                                return (
                                    <SecurityCard
                                        category={CATEGORIES.KUBERNETES_MANIFEST}
                                        subCategory={subCategory}
                                        severityCount={severityCount}
                                        handleCardClick={() =>
                                            handleCardClick(CATEGORIES.KUBERNETES_MANIFEST, subCategory)
                                        }
                                    />
                                )
                            })}
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
