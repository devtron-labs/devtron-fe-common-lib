import { DeploymentHistoryDetail } from '../CICDHistory'
import { CollapsibleListConfig, CollapsibleListItem } from '../CollapsibleList'
import { SelectPickerProps } from '../SelectPicker'

export interface DeploymentConfigType {
    list: DeploymentHistoryDetail
    heading: React.ReactNode
}

export interface DeploymentConfigListItem {
    id: string
    title: string
    primaryConfig: DeploymentConfigType
    secondaryConfig: DeploymentConfigType
    hasDiff?: boolean
    isDeploymentTemplate?: boolean
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

export interface DeploymentConfigDiffNavigationItem extends Pick<CollapsibleListItem, 'href' | 'title' | 'onClick'> {
    hasDiff?: boolean
}

export interface DeploymentConfigDiffNavigationCollapsibleItem
    extends Pick<CollapsibleListConfig, 'id' | 'header' | 'noItemsText'> {
    items: DeploymentConfigDiffNavigationItem[]
}

export interface DeploymentConfigDiffProps {
    isLoading?: boolean
    configList: DeploymentConfigListItem[]
    headerText?: string
    scrollIntoViewId?: string
    selectorsConfig: {
        primaryConfig: DeploymentConfigDiffSelectPickerProps[]
        secondaryConfig: DeploymentConfigDiffSelectPickerProps[]
    }
    onSortBtnClick?: () => void
    navList: DeploymentConfigDiffNavigationItem[]
    collapsibleNavList: DeploymentConfigDiffNavigationCollapsibleItem[]
    goBackURL?: string
    navHeading: string
    navHelpText?: string
}

export interface DeploymentConfigDiffNavigationProps
    extends Pick<
        DeploymentConfigDiffProps,
        'isLoading' | 'navList' | 'collapsibleNavList' | 'goBackURL' | 'navHeading' | 'navHelpText'
    > {}

export interface DeploymentConfigDiffMainProps
    extends Pick<
        DeploymentConfigDiffProps,
        'isLoading' | 'headerText' | 'configList' | 'scrollIntoViewId' | 'selectorsConfig' | 'onSortBtnClick'
    > {}

export interface DeploymentConfigDiffAccordionProps {
    id: string
    title: string
    children: React.ReactNode
    hasDiff?: boolean
    isExpanded?: boolean
    handleOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
