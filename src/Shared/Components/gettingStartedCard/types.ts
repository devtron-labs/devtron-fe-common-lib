import { ResponseType } from '../../../Common'

export interface LoginCount {
    emailId: string
    key: string
    value: string
}

export interface LoginCountType extends ResponseType {
    result?: LoginCount
}

export interface GettingStartedType {
    className: string
    showHelpCard: boolean
    hideGettingStartedCard: (count?: string) => void
    loginCount: number
}
