import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'
import { SCAN_TOOL_ID_CLAIR, SCAN_TOOL_ID_TRIVY } from '@Shared/constants'
import { useState } from 'react'
import SecurityCard from './SecurityCard'
import { CATEGORIES, SecurityModalStateType, SUB_CATEGORIES } from '../SecurityModal/types'
import { SecurityCardProps, SecurityDetailsCardsProps } from './types'
import { SecurityModal } from '../SecurityModal'
import { DEFAULT_SECURITY_MODAL_IMAGE_STATE } from '../SecurityModal/constants'
import { ScanCategories, ScanSubCategories } from '../types'
import './securityCard.scss'
import { getSecurityConfig } from '../utils'

const SecurityDetailsCards = ({ scanResult, Sidebar }: SecurityDetailsCardsProps) => {
    const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
    const [modalState, setModalState] = useState<SecurityModalStateType>(DEFAULT_SECURITY_MODAL_IMAGE_STATE)
    const { imageScan, codeScan, kubernetesManifest } = scanResult

    const SECURITY_CONFIG = getSecurityConfig({
        imageScan: !!imageScan,
        codeScan: !!codeScan,
        kubernetesManifest: !!kubernetesManifest,
    })

    const getScanToolId = (category: string) => {
        switch (category) {
            case CATEGORIES.CODE_SCAN:
                return codeScan?.scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR
            case CATEGORIES.KUBERNETES_MANIFEST:
                return kubernetesManifest?.scanToolName === 'TRIVY' ? SCAN_TOOL_ID_TRIVY : SCAN_TOOL_ID_CLAIR
            case CATEGORIES.IMAGE_SCAN:
                return imageScan?.vulnerability?.list?.[0].scanToolName === 'TRIVY'
                    ? SCAN_TOOL_ID_TRIVY
                    : SCAN_TOOL_ID_CLAIR
            default:
                return SCAN_TOOL_ID_TRIVY
        }
    }

    const handleOpenModal = (
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

    const handleCardClick =
        (category: SecurityCardProps['category'], subCategory: SecurityCardProps['subCategory']) => () =>
            handleOpenModal(category, subCategory)

    const handleModalClose = () => {
        setShowSecurityModal(false)
    }

    return (
        <>
            <div className="flexbox-col dc__gap-20">
                {Object.keys(SECURITY_CONFIG).map((category: ScanCategories) => (
                    <div className="flexbox-col dc__gap-12" key={category}>
                        <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                            <span className="fs-13 fw-6 lh-1-5 cn-9">{SECURITY_CONFIG[category].label}</span>
                            <ScannedByToolModal scanToolId={getScanToolId(category)} />
                        </div>
                        <div className="dc__grid security-cards">
                            {SECURITY_CONFIG[category].subCategories.map((subCategory: ScanSubCategories) => {
                                const severityCount =
                                    subCategory === SUB_CATEGORIES.MISCONFIGURATIONS
                                        ? scanResult[category][subCategory]?.misConfSummary?.status
                                        : scanResult[category][subCategory]?.summary?.severities

                                return (
                                    <SecurityCard
                                        category={category}
                                        subCategory={subCategory}
                                        severityCount={severityCount}
                                        handleCardClick={handleCardClick(category, subCategory)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ))}
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
