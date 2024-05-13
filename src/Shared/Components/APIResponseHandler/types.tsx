import { ReactNode } from 'react'
import {
    ErrorScreenManagerProps,
    GenericEmptyStateType,
    ProgressingProps,
    ReloadType,
    ServerErrors,
} from '../../../Common'
import { GenericSectionErrorStateProps } from '../GenericSectionErrorState/types'

export interface EmptyPageTextType {
    title?: GenericEmptyStateType['title']
    subTitle?: GenericEmptyStateType['subTitle']
}

export interface APIResponseHandlerProps {
    /**
     * If true, would show Progressing component
     */
    isLoading?: boolean
    /**
     * If loading is true, would load send these props to Progressing component
     */
    progressingProps?: ProgressingProps
    /**
     * If given, would show this component instead of default Progressing component
     */
    customLoader?: ReactNode
    /**
     * If true and isLoading is false would show default Reload component
     * In case error code is 404 show default 404 page using GenericEmptyState
     */
    error?: ServerErrors
    /**
     * Page text for 404 page
     */
    notFoundText?: EmptyPageTextType
    /**
     * If true would show Not Authorized page
     */
    notAuthorized?: boolean
    /**
     * If given, on Error, would load these props
     */
    reloadProps?: ReloadType
    /**
     * If given, would show GenericSectionErrorState instead of default Reload component
     */
    genericSectionErrorProps?: GenericSectionErrorStateProps
    /**
     * If given, would show ErrorScreenManager component instead of Reload component
     * Priority of error states are: genericSectionErrorProps > errorScreenManagerProps > Reload component
     */
    errorScreenManagerProps?: ErrorScreenManagerProps
    /**
     * If no Error and no Loading, would load this component
     */
    children: ReactNode
}
