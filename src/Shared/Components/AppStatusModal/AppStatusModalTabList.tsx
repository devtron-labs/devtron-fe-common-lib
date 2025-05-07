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
                              status={deploymentStatusDetailsBreakdownData.deploymentStatus}
                              hideMessage
                              showAnimatedIcon
                          />
                      ),
                  } satisfies TabProps,
              ]
            : []),
    ]

    // Could have achieved via onDataLoad but, have done this through useEffect to avoid abrupt shift in case some tabs went missing after polling
    useEffect(() => {
        if (tabGroups.length) {
            handleSelectTab(tabGroups[0]?.id as AppStatusModalTabType)
        }
    }, [])

    if (tabGroups.length <= 1) {
        return null
    }

    return <TabGroup tabs={tabGroups} hideTopPadding />
}

export default AppStatusModalTabList
