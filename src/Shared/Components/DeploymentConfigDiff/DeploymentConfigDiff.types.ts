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

import { SortingOrder } from '@Common/Constants'
import { RadioGroupItemProps, RadioGroupProps } from '@Common/Types'
import {
    AppEnvDeploymentConfigDTO,
    ConfigMapSecretDataConfigDatumDTO,
    DeploymentTemplateDTO,
    EnvResourceType,
    TemplateListDTO,
} from '@Shared/Services'
import { ManifestTemplateDTO } from '@Pages/Applications'

import { DeploymentHistoryDetail } from '../CICDHistory'
import { CollapseProps } from '../Collapse'
import { CollapsibleListConfig, CollapsibleListItem } from '../CollapsibleList'
import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

export enum DeploymentConfigDiffState {
    NO_DIFF = 'noDiff',
    HAS_DIFF = 'hasDiff',
    ADDED = 'added',
    DELETED = 'deleted',
}

export interface DeploymentConfigType {
    list: DeploymentHistoryDetail
    heading: React.ReactNode
}

export interface DeploymentConfigListItem {
    id: string
    title: string
    name?: string
    pathType: EnvResourceType
    primaryConfig: DeploymentConfigType
    secondaryConfig: DeploymentConfigType
    diffState: DeploymentConfigDiffState
    singleView?: boolean
    groupHeader?: string
}

interface DeploymentConfigDiffRadioConfig extends Pick<RadioGroupProps, 'name' | 'onChange'> {
    title: string
    options: (Pick<RadioGroupItemProps, 'disabled'> &
        Pick<SelectPickerOptionType<string>, 'label' | 'value' | 'description' | 'tooltipProps'>)[]
    groupValue: string
}

export interface DeploymentConfigDiffRadioSelectConfig {
    triggerElementTitle: string
    radioGroupConfig: DeploymentConfigDiffRadioConfig[]
}

export type DeploymentConfigDiffSelectPickerProps =
    | {
          type: 'string'
          id: string
          text: string | React.ReactNode
          selectPickerProps?: never
      }
    | {
          type: 'selectPicker'
          id: string
          text?: never
          selectPickerProps: SelectPickerProps
      }
    | {
          type: 'radio-group'
          id: string
          text?: never
          radioSelectConfig: DeploymentConfigDiffRadioSelectConfig
          selectPickerProps?: never
      }

export interface DeploymentConfigDiffNavigationItem
    extends Pick<CollapsibleListItem<'navLink'>, 'href' | 'title' | 'onClick'> {
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    diffState: DeploymentConfigListItem['diffState']
}

export interface DeploymentConfigDiffNavigationCollapsibleItem
    extends Pick<CollapsibleListConfig<'navLink'>, 'id' | 'header' | 'noItemsText'> {
    items: DeploymentConfigDiffNavigationItem[]
}

export interface DeploymentConfigDiffProps {
    isLoading?: boolean
    errorConfig?: {
        error: boolean
        code: number
        message?: string
        redirectURL?: string
        reload: () => void
    }
    configList: DeploymentConfigListItem[]
    showDetailedDiffState?: boolean
    hideDiffState?: boolean
    headerText?: string
    scrollIntoViewId?: string
    selectorsConfig: {
        primaryConfig: DeploymentConfigDiffSelectPickerProps[]
        secondaryConfig: DeploymentConfigDiffSelectPickerProps[]
        hideDivider?: boolean
    }
    sortingConfig?: {
        sortBy: string
        sortOrder: SortingOrder
        handleSorting: () => void
    }
    navList: DeploymentConfigDiffNavigationItem[]
    collapsibleNavList: DeploymentConfigDiffNavigationCollapsibleItem[]
    goBackURL?: string
    navHeading: string
    navHelpText?: string
    isNavHelpTextShowingError?: boolean
    tabConfig?: {
        tabs: string[]
        activeTab: string
        onClick: (tab: string) => void
    }
    scopeVariablesConfig?: {
        convertVariables: boolean
        onConvertVariablesClick: () => void
    }
    renderedInDrawer?: boolean
}

export interface DeploymentConfigDiffNavigationProps
    extends Pick<
        DeploymentConfigDiffProps,
        | 'isLoading'
        | 'navList'
        | 'collapsibleNavList'
        | 'goBackURL'
        | 'navHeading'
        | 'navHelpText'
        | 'tabConfig'
        | 'errorConfig'
        | 'isNavHelpTextShowingError'
        | 'showDetailedDiffState'
        | 'hideDiffState'
    > {}

export interface DeploymentConfigDiffMainProps
    extends Pick<
        DeploymentConfigDiffProps,
        | 'isLoading'
        | 'errorConfig'
        | 'headerText'
        | 'configList'
        | 'scrollIntoViewId'
        | 'selectorsConfig'
        | 'sortingConfig'
        | 'scopeVariablesConfig'
        | 'showDetailedDiffState'
        | 'hideDiffState'
    > {}

export type DeploymentConfigDiffAccordionProps = Pick<CollapseProps, 'onTransitionEnd'> &
    Pick<DeploymentConfigDiffProps, 'showDetailedDiffState' | 'hideDiffState'> & {
        id: string
        title: string
        children: React.ReactNode
        diffState: DeploymentConfigDiffState
        isExpanded?: boolean
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    }

export type DiffHeadingDataType<DeploymentTemplate> = DeploymentTemplate extends true
    ? DeploymentTemplateDTO
    : ConfigMapSecretDataConfigDatumDTO

export type AppEnvDeploymentConfigListParams<IsManifestView> = (IsManifestView extends true
    ? {
          currentList: ManifestTemplateDTO
          compareList: ManifestTemplateDTO
          compareToTemplateOptions?: never
          compareWithTemplateOptions?: never
          sortingConfig?: never
      }
    : {
          currentList: AppEnvDeploymentConfigDTO
          compareList: AppEnvDeploymentConfigDTO
          compareToTemplateOptions?: TemplateListDTO[]
          compareWithTemplateOptions?: TemplateListDTO[]
          sortingConfig?: Pick<DeploymentConfigDiffProps['sortingConfig'], 'sortBy' | 'sortOrder'>
      }) & {
    getNavItemHref: (resourceType: EnvResourceType, resourceName: string) => string
    isManifestView?: IsManifestView
    convertVariables?: boolean
}
