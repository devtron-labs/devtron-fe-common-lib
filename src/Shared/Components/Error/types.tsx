import { AppDetails } from '../../types'

export interface ErrorBarType {
    appDetails: AppDetails
}

export enum AppDetailsErrorType {
    ERRIMAGEPULL = 'errimagepull',
    IMAGEPULLBACKOFF = 'imagepullbackoff',
}
