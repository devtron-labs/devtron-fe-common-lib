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

import { useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { ReactComponent as AddIcon } from '@Icons/ic-add.svg'
import { ReactComponent as DropDown } from '@Icons/ic-caret-down-small.svg'
import { ReactComponent as ChartIcon } from '@Icons/ic-charts.svg'
import { ReactComponent as JobIcon } from '@Icons/ic-k8s-job.svg'
import Button from '@Shared/Components/Button/Button.component'

import { Modal, SERVER_MODE, URLS } from '../../../../Common'
import { AppListConstants, ComponentSizeType } from '../../../constants'
import { useMainContext } from '../../../Providers'
import PageHeader from '../PageHeader'
import { getIsShowingLicenseData } from '../utils'

import './HeaderWithCreateButton.scss'

export interface HeaderWithCreateButtonProps {
    headerName: string
}

export const HeaderWithCreateButton = ({ headerName }: HeaderWithCreateButtonProps) => {
    const params = useParams<{ appType: string }>()
    const history = useHistory()
    const location = useLocation()
    const { serverMode, licenseData } = useMainContext()
    const [showCreateSelectionModal, setShowCreateSelectionModal] = useState(false)

    const showingLicenseBar = getIsShowingLicenseData(licenseData)

    const handleCreateButton = () => {
        setShowCreateSelectionModal((prevState) => !prevState)
    }

    const redirectToHelmAppDiscover = () => {
        history.push(URLS.CHARTS_DISCOVER)
    }

    const openCreateDevtronAppModel = () => {
        const _urlPrefix = `${URLS.APP}/${URLS.APP_LIST}/${params.appType ?? AppListConstants.AppType.DEVTRON_APPS}`
        history.push(`${_urlPrefix}/${AppListConstants.CREATE_DEVTRON_APP_URL}${location.search}`)
    }

    const openCreateJobModel = () => {
        history.push(`${URLS.JOB}/${URLS.APP_LIST}/${URLS.CREATE_JOB}`)
    }

    const renderActionButtons = () =>
        serverMode === SERVER_MODE.FULL ? (
            <Button
                text="Create"
                onClick={handleCreateButton}
                dataTestId="create-app-button-on-header"
                endIcon={<DropDown className="icon-dim-20" />}
                size={ComponentSizeType.small}
            />
        ) : (
            <Button
                text="Deploy helm charts"
                onClick={redirectToHelmAppDiscover}
                dataTestId="deploy-helm-chart-on-header"
                size={ComponentSizeType.small}
            />
        )

    const renderCreateSelectionModal = () => (
        <Modal
            rootClassName={`create-modal-wrapper ${showingLicenseBar ? 'with-bar' : ''}
                 ${window._env_.FEATURE_PROMO_EMBEDDED_BUTTON_TEXT ? 'create-modal-wrapper--try-devtron' : ''}`}
            onClick={handleCreateButton}
        >
            <div
                className="create-modal-child cursor"
                onClick={openCreateDevtronAppModel}
                data-testid="create-custom-app-button-in-dropdown"
            >
                <AddIcon className="icon-dim-20 fcn-9" />
                <div className="ml-8">
                    <strong>Custom app</strong>
                    <div>
                        Connect a git repository to deploy <br /> a custom application
                    </div>
                </div>
            </div>
            <div
                className="create-modal-child cursor"
                onClick={redirectToHelmAppDiscover}
                data-testid="create-from-chart-store-button"
            >
                <ChartIcon className="icon-dim-20 fcn-9" />
                <div className="ml-8">
                    <strong>From Chart store</strong>
                    <div>
                        Deploy apps using third party helm <br /> charts (eg. prometheus, redis etc.)
                    </div>
                </div>
            </div>
            <div
                className="create-modal-child cursor"
                onClick={openCreateJobModel}
                data-testid="create-job-button-in-dropdown"
            >
                <JobIcon className="icon-dim-20 scn-9" />
                <div className="ml-8">
                    <strong>Job</strong>
                    <div>
                        Jobs allow manual and automated <br /> execution of developer actions.
                    </div>
                </div>
            </div>
        </Modal>
    )
    return (
        <div className="create-button-container dc__position-sticky dc__top-0 bg__primary dc__zi-4">
            <PageHeader headerName={headerName} renderActionButtons={renderActionButtons} />
            {showCreateSelectionModal && renderCreateSelectionModal()}
        </div>
    )
}

export default HeaderWithCreateButton
