import { ButtonComponentType, ButtonProps, IconName } from '@Shared/Components'
import { IconBaseColorType } from '@Shared/types'

export interface SectionEmptyStateProps {
    iconColor?: IconBaseColorType
    iconName?: IconName
    title: string
    subtitle?: string
    buttonConfig?: ButtonProps<ButtonComponentType>
}

export interface MetricsInfoCardProps {
    dataTestId: string
    metricTitle: string
    metricValue: string
    metricUnit?: string
    valueOutOf?: string
    iconName: IconName
    subtitle?: string
    tooltipContent: string
    redirectionLink?: string
    subtitleRedirection?: string
}

export enum ProdNonProdSelectValueTypes {
    ALL = 'All',
    PRODUCTION = 'Prod',
    NON_PRODUCTION = 'Non-Prod',
}
