import { ReactNode, SyntheticEvent } from 'react'

export enum ConfigHeaderTabType {
    VALUES = 'values',
    INHERITED = 'inherited',
    DRY_RUN = 'dryRun',
}

export enum ProtectConfigTabsType {
    PUBLISHED = 'published',
    COMPARE = 'compare',
    EDIT_DRAFT = 'editDraft',
}

export enum OverrideMergeStrategyType {
    PATCH = 'patch',
    REPLACE = 'replace',
}

export interface ConfigToolbarPopupMenuConfigType {
    text: string
    onClick: (event: SyntheticEvent) => void
    dataTestId: string
    disabled?: boolean
    icon?: ReactNode | null
    variant?: 'default' | 'negative'
    tooltipText?: string
}

export enum ConfigToolbarPopupNodeType {
    DISCARD_DRAFT = 'discardDraft',
    EDIT_HISTORY = 'editHistory',
}

export interface OverrideStrategyTippyContentProps {
    /**
     * Would be rendered as li conveying the information about the merge strategy
     */
    children?: ReactNode
}
