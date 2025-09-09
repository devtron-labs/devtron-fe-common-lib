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

import { useLocation, useParams } from 'react-router-dom'

import { SERVER_MODE, URLS } from '@Common/Constants'
import { noop } from '@Common/Helper'
import { BreadCrumb, useBreadcrumb } from '@Common/index'
import { ActionMenu } from '@Shared/Components/ActionMenu'
import { ButtonComponentType } from '@Shared/Components/Button'
import Button from '@Shared/Components/Button/Button.component'
import { Icon } from '@Shared/Components/Icon'
import { AppListConstants, ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'
import { getApplicationManagementBreadcrumb } from '@PagesDevtron2.0/InfrastructureManagement'
import { getAutomationEnablementBreadcrumbConfig } from '@PagesDevtron2.0/InfrastructureManagement/utils'

import PageHeader from '../PageHeader'
import { HeaderWithCreateButtonProps } from './types'
import { getCreateActionMenuOptions } from './utils'

export const HeaderWithCreateButton = ({ isJobView }: HeaderWithCreateButtonProps) => {
    // HOOKS
    const { serverMode } = useMainContext()
    const params = useParams<{ appType: string }>()
    const location = useLocation()

    // CONSTANTS
    const createCustomAppURL = `${URLS.APPLICATION_MANAGEMENT_APP}/${URLS.APP_LIST}/${params.appType ?? AppListConstants.AppType.DEVTRON_APPS}/${AppListConstants.CREATE_DEVTRON_APP_URL}${location.search}`

    const renderActionButtons = () =>
        serverMode === SERVER_MODE.FULL ? (
            <ActionMenu
                id="page-header-create-app-action-menu"
                alignment="end"
                onClick={noop}
                options={getCreateActionMenuOptions(createCustomAppURL)}
                buttonProps={{
                    text: 'Create',
                    dataTestId: 'create-app-button-on-header',
                    endIcon: <Icon name="ic-caret-down-small" color={null} />,
                    size: ComponentSizeType.small,
                }}
            />
        ) : (
            <Button
                text="Deploy helm charts"
                component={ButtonComponentType.link}
                linkProps={{ to: URLS.APPLICATION_MANAGEMENT_CHART_STORE_DISCOVER }}
                dataTestId="deploy-helm-chart-on-header"
                size={ComponentSizeType.small}
            />
        )

    const { breadcrumbs } = useBreadcrumb(
        {
            alias: {
                ...(isJobView ? getAutomationEnablementBreadcrumbConfig() : getApplicationManagementBreadcrumb()),
                ':appType': null,
            },
        },
        [location.pathname],
    )
    const renderBreadcrumbs = () => <BreadCrumb breadcrumbs={breadcrumbs} />

    return (
        <div className="create-button-container dc__position-sticky dc__top-0 bg__primary dc__zi-4">
            <PageHeader
                isBreadcrumbs
                breadCrumbs={renderBreadcrumbs}
                renderActionButtons={renderActionButtons}
                {...(isJobView
                    ? {
                          tippyProps: {
                              isTippyCustomized: true,
                              tippyRedirectLink: 'JOBS',
                              tippyMessage:
                                  'Job allows execution of repetitive tasks in a manual or automated manner. Execute custom tasks or choose from a library of preset plugins in your job pipeline.',
                              tippyHeader: 'Job',
                          },
                      }
                    : {})}
            />
        </div>
    )
}

export default HeaderWithCreateButton
