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

import { useLocation } from 'react-router-dom'

import { SERVER_MODE } from '@Common/Constants'
import { noop } from '@Common/Helper'
import { BreadCrumb, BreadcrumbText, useBreadcrumb } from '@Common/index'
import { ActionMenu } from '@Shared/Components/ActionMenu'
import { ButtonComponentType } from '@Shared/Components/Button'
import Button from '@Shared/Components/Button/Button.component'
import { DOCUMENTATION } from '@Shared/Components/DocLink'
import { Icon } from '@Shared/Components/Icon'
import { ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'
import { getApplicationManagementBreadcrumb } from '@PagesDevtron2.0/ApplicationManagement'
import { getAutomationEnablementBreadcrumb } from '@PagesDevtron2.0/Automation&Enablement'
import { getInfrastructureManagementBreadcrumb } from '@PagesDevtron2.0/InfrastructureManagement'
import { ROUTER_URLS } from '@PagesDevtron2.0/Shared'

import PageHeader from '../PageHeader'
import { HeaderWithCreateButtonProps } from './types'
import { getCreateActionMenuOptions } from './utils'

export const HeaderWithCreateButton = ({ viewType }: HeaderWithCreateButtonProps) => {
    // HOOKS
    const location = useLocation()
    const { serverMode } = useMainContext()

    // CONSTANTS
    const createCustomAppURL = `${ROUTER_URLS.CREATE_DEVTRON_APP}${location.search}`
    const createJobURL = `${ROUTER_URLS.CREATE_JOB}${location.search}`

    const renderActionButtons = () =>
        serverMode === SERVER_MODE.FULL ? (
            <ActionMenu
                id="page-header-create-app-action-menu"
                alignment="end"
                onClick={noop}
                options={getCreateActionMenuOptions(createCustomAppURL, createJobURL)}
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
                linkProps={{ to: ROUTER_URLS.CHART_STORE }}
                dataTestId="deploy-helm-chart-on-header"
                size={ComponentSizeType.small}
            />
        )

    const getPathPattern = () => {
        switch (viewType) {
            case 'jobs':
                return ROUTER_URLS.JOBS_LIST
            case 'infra-apps':
                return ROUTER_URLS.INFRASTRUCTURE_MANAGEMENT_APP_LIST.ROUTE
            case 'apps':
            default:
                return ROUTER_URLS.DEVTRON_APP_LIST
        }
    }

    const pathPattern = getPathPattern()

    const getBreadcrumbs = () => {
        switch (viewType) {
            case 'jobs':
                return {
                    ...getAutomationEnablementBreadcrumb(),
                    job: null,
                    list: { component: <BreadcrumbText isActive heading="Jobs" /> },
                }
            case 'infra-apps':
                return {
                    ...getInfrastructureManagementBreadcrumb(),
                    apps: { component: <BreadcrumbText isActive heading="Applications" /> },
                    ':appType': null,
                }
            case 'apps':
            default:
                return {
                    ...getApplicationManagementBreadcrumb(),
                    'devtron-app': { component: <BreadcrumbText isActive heading="Devtron Applications" /> },
                    list: null,
                }
        }
    }

    const { breadcrumbs } = useBreadcrumb(
        pathPattern,
        {
            alias: getBreadcrumbs(),
        },
        [location.pathname],
    )
    const renderBreadcrumbs = () => <BreadCrumb breadcrumbs={breadcrumbs} path={pathPattern} />

    const getDocPath = () => {
        if (viewType === 'jobs') {
            return DOCUMENTATION.AUTOMATION_AND_ENABLEMENT
        }
        if (viewType === 'infra-apps') {
            return DOCUMENTATION.INFRA_MANAGEMENT
        }
        return DOCUMENTATION.APP_MANAGEMENT
    }

    return (
        <div className="create-button-container dc__position-sticky dc__top-0 bg__primary dc__zi-4">
            <PageHeader
                isBreadcrumbs
                breadCrumbs={renderBreadcrumbs}
                renderActionButtons={renderActionButtons}
                {...(viewType === 'jobs'
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
                docPath={getDocPath()}
            />
        </div>
    )
}

export default HeaderWithCreateButton
