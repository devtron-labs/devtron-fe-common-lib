import { ScannedByToolModal } from '@Shared/Components/ScannedByToolModal'
import { EMPTY_STATE_STATUS } from '@Shared/constants'
import { useState } from 'react'
import { GenericEmptyState } from '@Common/index'
import { ReactComponent as NoVulnerability } from '@Icons/ic-vulnerability-not-found.svg'
import { GenericSectionErrorState } from '@Shared/Components/GenericSectionErrorState'
import SecurityCard from './SecurityCard'
import { CATEGORIES, SecurityModalStateType, SUB_CATEGORIES } from '../SecurityModal/types'
import { SecurityCardProps, SecurityDetailsCardsProps } from './types'
import { SecurityModal } from '../SecurityModal'
import { DEFAULT_SECURITY_MODAL_IMAGE_STATE } from '../SecurityModal/constants'
import { ScanCategories, ScanSubCategories } from '../types'
import { getSecurityConfig, getCompiledSecurityThreats, getTotalSeverities, getStatusForScanList } from '../utils'
import './securityCard.scss'

const SecurityDetailsCards = ({ scanResult, Sidebar }: SecurityDetailsCardsProps) => {
    const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
    const [modalState, setModalState] = useState<SecurityModalStateType>(DEFAULT_SECURITY_MODAL_IMAGE_STATE)
    const { imageScan, codeScan, kubernetesManifest } = scanResult

    const scanThreats = getCompiledSecurityThreats(scanResult)
    const threatCount = getTotalSeverities(scanThreats)

    if (!threatCount) {
        return (
            <GenericEmptyState
                SvgImage={NoVulnerability}
                title={EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.TITLE}
                subTitle={EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.SUBTITLE}
            />
        )
    }

    const SECURITY_CONFIG = getSecurityConfig({
        imageScan: !!imageScan,
        codeScan: !!codeScan,
        kubernetesManifest: !!kubernetesManifest,
    })

    const getScanToolInfo = (category: string): { scanToolName: string; scanToolUrl: string } => {
        const image = imageScan?.vulnerability?.list?.[0]
        switch (category) {
            case CATEGORIES.CODE_SCAN:
                return { scanToolName: codeScan?.scanToolName, scanToolUrl: codeScan?.scanToolUrl }
            case CATEGORIES.KUBERNETES_MANIFEST:
                return { scanToolName: kubernetesManifest?.scanToolName, scanToolUrl: kubernetesManifest?.scanToolUrl }
            default:
                return {
                    scanToolName: image?.scanToolName,
                    scanToolUrl: image?.scanToolUrl,
                }
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
            <div className="flexbox-col dc__gap-20 mw-600 dc__mxw-1200">
                {Object.keys(SECURITY_CONFIG).map((category: ScanCategories) => {
                    const categoryFailed: boolean =
                        category !== CATEGORIES.IMAGE_SCAN &&
                        (scanResult.codeScan?.status === 'Failed' || scanResult.kubernetesManifest?.status === 'Failed')

                    const { scanToolName, scanToolUrl } = getScanToolInfo(category)

                    return (
                        <div className="flexbox-col dc__gap-12" key={category}>
                            <div className="flexbox dc__content-space pb-8 dc__border-bottom-n1">
                                <span className="fs-13 fw-6 lh-1-5 cn-9">{SECURITY_CONFIG[category].label}</span>
                                <ScannedByToolModal scanToolName={scanToolName} scanToolUrl={scanToolUrl} />
                            </div>
                            {categoryFailed ? (
                                <div className="dc__border br-8">
                                    <GenericSectionErrorState
                                        title={
                                            category === CATEGORIES.CODE_SCAN
                                                ? 'Code scan failed'
                                                : 'Manifest scan failed'
                                        }
                                        subTitle=""
                                        description=""
                                    />
                                </div>
                            ) : (
                                <div className="dc__grid security-cards">
                                    {SECURITY_CONFIG[category].subCategories.map((subCategory: ScanSubCategories) => {
                                        // Explicit handling if subcategory is null
                                        if (!scanResult[category][subCategory]) {
                                            return null
                                        }

                                        const scanFailed: boolean =
                                            category === CATEGORIES.IMAGE_SCAN &&
                                            getStatusForScanList(scanResult[category][subCategory].list ?? []) ===
                                                'Failed'

                                        const severities =
                                            subCategory === SUB_CATEGORIES.MISCONFIGURATIONS
                                                ? scanResult[category][subCategory]?.misConfSummary?.status
                                                : scanResult[category][subCategory]?.summary?.severities

                                        return (
                                            <SecurityCard
                                                category={category}
                                                subCategory={subCategory}
                                                severities={severities}
                                                handleCardClick={handleCardClick(category, subCategory)}
                                                scanFailed={scanFailed}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
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
