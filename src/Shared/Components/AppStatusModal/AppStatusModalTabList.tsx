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

import { useEffect } from 'react'

import { AppStatus, DeploymentStatus } from '../StatusComponent'
import { TabGroup, TabProps } from '../TabGroup'
import { AppStatusModalTabListProps, AppStatusModalTabType } from './types'
import { getShowDeploymentStatusModal } from './utils'

const AppStatusModalTabList = ({
    handleSelectTab,
    appDetails,
    type,
    selectedTab,
    deploymentStatusDetailsBreakdownData,
}: AppStatusModalTabListProps) => {
    const showDeploymentStatusModal =
        selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS ||
        getShowDeploymentStatusModal({
            type,
            appDetails,
        })

    const showApplicationStatus = selectedTab === AppStatusModalTabType.APP_STATUS || !!appDetails?.resourceTree

    const handleSelectAppStatus = () => {
        handleSelectTab(AppStatusModalTabType.APP_STATUS)
    }

    const handleSelectDeploymentStatusTab = () => {
        handleSelectTab(AppStatusModalTabType.DEPLOYMENT_STATUS)
    }

    const tabGroups: TabProps[] = [
        ...(showApplicationStatus
            ? [
                  {
                      id: AppStatusModalTabType.APP_STATUS,
                      label: 'Application Status',
                      tabType: 'button',
                      props: {
                          onClick: handleSelectAppStatus,
                          'data-testid': 'app-status-tab',
                      },
                      active: selectedTab === AppStatusModalTabType.APP_STATUS,
                      iconElement: (
                          <AppStatus
                              status={appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus}
                              hideMessage
                              showAnimatedIcon
                              hideIconTooltip
                          />
                      ),
                  } satisfies TabProps,
              ]
            : []),
        ...(showDeploymentStatusModal
            ? [
                  {
                      id: AppStatusModalTabType.DEPLOYMENT_STATUS,
                      label: 'Deployment Status',
                      tabType: 'button',
                      props: {
                          onClick: handleSelectDeploymentStatusTab,
                          'data-testid': 'deployment-status-tab',
                      },
                      active: selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS,
                      iconElement: (
                          <DeploymentStatus
                              status={deploymentStatusDetailsBreakdownData?.deploymentStatus}
                              hideMessage
                              showAnimatedIcon
                              hideIconTooltip
                          />
                      ),
                  } satisfies TabProps,
              ]
            : []),
    ]

    // Could have achieved via onDataLoad but, have done this through useEffect to avoid abrupt shift in case some tabs went missing after polling
    useEffect(() => {
        if (tabGroups.length && !selectedTab) {
            handleSelectTab(tabGroups[0].id as AppStatusModalTabType)
        }
    }, [])

    if (tabGroups.length <= 1) {
        return null
    }

    return <TabGroup tabs={tabGroups} hideTopPadding />
}

export default AppStatusModalTabList
