/*
 * Copyright (c) 2024. Devtron Inc.
 */

import React, { useState } from 'react'
import {
    ErrorScreenManager,
    ClipboardButton,
    GenericEmptyState,
    ImageType,
    Progressing,
    stopPropagation,
    VisibleModal2,
} from '@Common/index'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICBack } from '@Icons/ic-caret-left-small.svg'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components/Button'
import { ComponentSizeType } from '@Shared/constants'
import { Table, InfoCard } from './components'
import { getDefaultSecurityModalState } from './constants'
import { getTableData, getInfoCardData } from './config'
import { SecurityModalPropsType, SecurityModalStateType, DetailViewDataType, SidebarPropsType } from './types'
import { getEmptyStateValues } from './config/EmptyState'
import './styles.scss'

/**
 * NOTE: the security modal is split into 3 sections - ImageScan, CodeScan & Kubernetes Manifest;
 * Each category has 1 or more subCategories from the set (Vulnerability, License, MisConfigurations & ExposedSecrets)
 * Since each combination of category & subCategory results in the data being visualized through InfoCard & Table
 * the components are declared & called only once and only the data (props) passed to these components differ
 * between the different configurations of category & subCategory. Some row elements from some combinations
 * of Category & SubCategory can allow users to view that particular data in detail (taking user to detailView)
 * So to showcase the detail data, the data is set into detailViewData property of ModalState.
 * For further detail please refer the types to understand the Api Response and workflow of the modal component.
 * */
const SecurityModal: React.FC<SecurityModalPropsType> = ({
    Sidebar,
    handleModalClose,
    isLoading,
    error,
    responseData,
    hidePolicy = false,
    defaultState,
}) => {
    const data = responseData ?? null

    const categoriesConfig: SidebarPropsType['categoriesConfig'] = {
        imageScan: !!data?.imageScan,
        imageScanLicenseRisks: !!data?.imageScan?.license,
        codeScan: !!data?.codeScan,
        kubernetesManifest: !!data?.kubernetesManifest,
    }

    const [state, setState] = useState<SecurityModalStateType>(
        defaultState ?? getDefaultSecurityModalState(categoriesConfig),
    )

    const setDetailViewData = (detailViewData: DetailViewDataType) => {
        setState((prevState) => ({
            ...prevState,
            detailViewData: [...(prevState.detailViewData ?? []), detailViewData],
        }))
    }

    const handleBackFromDetailView = () => {
        setState((prevState) => ({ ...prevState, detailViewData: prevState.detailViewData?.slice(0, -1) ?? null }))
    }

    const topLevelDetailViewDataIndex = (state.detailViewData?.length ?? 0) - 1
    const selectedDetailViewData = state.detailViewData?.[topLevelDetailViewDataIndex] ?? null

    const renderHeader = () => (
        <div className="flexbox dc__content-space dc__align-items-center pl-20 pr-20 pt-12 pb-12 dc__border-bottom">
            <span className="fs-16 fw-6 lh-24 cn-9">Security</span>
            <Button
                dataTestId="close-security-modal"
                ariaLabel="close-security-modal"
                icon={<ICClose />}
                onClick={handleModalClose}
                showAriaLabelInTippy={false}
                size={ComponentSizeType.xs}
                style={ButtonStyleType.negativeGrey}
                variant={ButtonVariantType.borderLess}
            />
        </div>
    )

    const renderDetailViewSubHeader = () => (
        <div className="pt-10 pb-10 pl-12 pr-12 flexbox dc__align-items-center dc__gap-12 dc__position-sticky dc__border-bottom-n1 dc__top-0 bg__primary dc__zi-20">
            <button
                type="button"
                className="dc__unset-button-styles"
                aria-label="Go back"
                onClick={handleBackFromDetailView}
            >
                <div className="dc__border-radius-4-imp dc__hover-n50 dc__border c-n50 flex">
                    <ICBack className="icon-dim-16" />
                </div>
            </button>
            <div className="flexbox dc__gap-4" data-testid="security-detail-view-strip">
                <span className="fs-13 fw-6 lh-20 cn-900">{selectedDetailViewData.titlePrefix}:</span>
                <span className="fs-13 fw-4 lh-20 cn-900 mono dc__truncate dc__mxw-600">
                    {selectedDetailViewData.title}
                </span>
                <ClipboardButton content={selectedDetailViewData.title} />
            </div>
        </div>
    )

    const renderInfoCardAndTable = () => {
        /* NOTE: if no data to process further show emptyState */
        const emptyState = getEmptyStateValues(data, state.category, state.subCategory, selectedDetailViewData)

        if (emptyState) {
            return <GenericEmptyState {...emptyState} imageType={ImageType.Large} />
        }

        /* NOTE: if detailView is active show data gathered from that */
        const { headers, rows, defaultSortIndex, hasExpandableRows } =
            selectedDetailViewData ||
            getTableData(data, state.category, state.subCategory, setDetailViewData, hidePolicy)

        const { entities, lastScanTimeString, scanToolId } =
            selectedDetailViewData || getInfoCardData(data, state.category, state.subCategory)

        return (
            <div className="flexbox-col p-20 dc__gap-16">
                {!entities?.length ? null : (
                    <InfoCard entities={entities} lastScanTimeString={lastScanTimeString} scanToolId={scanToolId} />
                )}
                <Table
                    // NOTE: this key is important. Whenever data changes the table should be remounted
                    key={`${state.category}${state.subCategory}${topLevelDetailViewDataIndex}`}
                    headers={headers}
                    rows={rows}
                    defaultSortIndex={defaultSortIndex}
                    hasExpandableRows={hasExpandableRows}
                    headerTopPosition={selectedDetailViewData ? 40 : 0}
                />
            </div>
        )
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="h-100 w-100 flex">
                    <Progressing size={24} pageLoader />
                </div>
            )
        }

        if (error) {
            return (
                <div className="h-100 w-100 flex">
                    <ErrorScreenManager code={error.code} />
                </div>
            )
        }

        return (
            /* NOTE: the height is restricted to (viewport - header) height since we need overflow-scroll */
            <div className="flexbox" style={{ height: 'calc(100vh - 49px)' }}>
                {/* NOTE: only show sidebar in AppDetails */}
                {Sidebar && <Sidebar modalState={state} setModalState={setState} categoriesConfig={categoriesConfig} />}
                <div className="dc__border-right-n1 h-100" />
                <div className="dc__overflow-auto flex-grow-1" style={{ width: '744px' }}>
                    {selectedDetailViewData && renderDetailViewSubHeader()}
                    {data && renderInfoCardAndTable()}
                </div>
            </div>
        )
    }

    return (
        <VisibleModal2 className="dc__position-rel" close={handleModalClose}>
            <div
                className={`${Sidebar ? 'w-1024' : 'w-800'} h-100vh bg__primary flexbox-col dc__right-0 dc__top-0 dc__position-abs`}
                onClick={stopPropagation}
            >
                {renderHeader()}
                {renderContent()}
            </div>
        </VisibleModal2>
    )
}

export default SecurityModal
