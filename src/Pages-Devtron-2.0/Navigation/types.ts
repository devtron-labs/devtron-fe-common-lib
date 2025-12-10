import { customEnv, Never } from 'src'

import { IconsProps } from '@Shared/Components'

export type NavigationItemID =
    | 'application-management-overview'
    | 'application-management-devtron-applications'
    | 'application-management-application-groups'
    | 'application-management-bulk-edit'
    | 'application-management-application-templates'
    | 'application-management-projects'
    | 'application-management-configurations'
    | 'application-management-policies'
    | 'infrastructure-management-overview'
    | 'infrastructure-management-applications'
    | 'infrastructure-management-chart-store'
    | 'infrastructure-management-resource-browser'
    | 'infrastructure-management-resource-watcher'
    | 'infrastructure-management-catalog-framework'
    | 'software-release-management-overview'
    | 'software-release-management-release-hub'
    | 'software-release-management-tenants'
    | 'cost-visibility-overview'
    | 'cost-visibility-cost-breakdown'
    | 'cost-visibility-configurations'
    | 'security-center-overview'
    | 'security-center-security-vulnerabilities'
    | 'security-center-security-enablement'
    | 'security-center-security-policy'
    | 'automation-and-enablement-jobs'
    | 'automation-and-enablement-alerting'
    | 'automation-and-enablement-incident-response'
    | 'automation-and-enablement-api-portal'
    | 'automation-and-enablement-runbook-automation'
    | 'global-configuration-sso-login-services'
    | 'global-configuration-host-urls'
    | 'global-configuration-cluster-and-environments'
    | 'global-configuration-container-oci-registry'
    | 'global-configuration-authorization'
    | 'data-protection-overview'
    | 'data-protection-backup-and-schedule'
    | 'data-protection-restores'
    | 'data-protection-backup-repositories'
    | 'data-protection-backup-locations'
    | 'data-protection-history-and-logs'

export type NavigationSubMenuItemID =
    | 'application-management-configurations-gitops'
    | 'application-management-configurations-git-accounts'
    | 'application-management-configurations-external-links'
    | 'application-management-configurations-chart-repository'
    | 'application-management-configurations-deployment-charts'
    | 'application-management-configurations-notifications'
    | 'application-management-configurations-catalog-frameworks'
    | 'application-management-configurations-scoped-variables'
    | 'application-management-configurations-build-infra'
    | 'application-management-policies-deployment-window'
    | 'application-management-policies-approval-policy'
    | 'application-management-policies-plugin-policy'
    | 'application-management-policies-pull-image-digest'
    | 'application-management-policies-tag-policy'
    | 'application-management-policies-filter-conditions'
    | 'application-management-policies-image-promotion'
    | 'application-management-policies-lock-deployment-configuration'
    | 'cost-visibility-cost-breakdown-clusters'
    | 'cost-visibility-cost-breakdown-environments'
    | 'cost-visibility-cost-breakdown-projects'
    | 'cost-visibility-cost-breakdown-applications'
    | 'global-configuration-authorization-user-permissions'
    | 'global-configuration-authorization-permission-groups'
    | 'global-configuration-authorization-api-tokens'

export type NavigationRootItemID =
    | 'application-management'
    | 'infrastructure-management'
    | 'software-release-management'
    | 'cost-visibility'
    | 'security-center'
    | 'automation-and-enablement'
    | 'data-protection-management'
    | 'global-configuration'

export type CommonNavigationItemType = {
    title: string
    dataTestId: string
    icon: IconsProps['name']
    href: string
    disabled?: boolean
    keywords?: string[]
    forceHideEnvKey?: keyof customEnv
    hideNav?: boolean
    isAvailableInEA?: boolean
}

export type NavigationItemType = Pick<
    CommonNavigationItemType,
    'dataTestId' | 'title' | 'disabled' | 'keywords' | 'hideNav' | 'forceHideEnvKey' | 'isAvailableInEA'
> & {
    id: NavigationItemID
} & (
        | (Pick<CommonNavigationItemType, 'icon' | 'href'> & {
              hasSubMenu?: false
              subItems?: never
          })
        | (Never<Pick<CommonNavigationItemType, 'icon' | 'href'>> & {
              hasSubMenu: true
              subItems: (Omit<CommonNavigationItemType, 'icon' | 'isAvailableInEA'> & { id: NavigationSubMenuItemID })[]
          })
    )

export interface NavigationGroupType
    extends Pick<CommonNavigationItemType, 'title' | 'icon' | 'hideNav' | 'forceHideEnvKey' | 'isAvailableInEA'> {
    id: NavigationRootItemID
    items: NavigationItemType[]
    disabled?: boolean
}
