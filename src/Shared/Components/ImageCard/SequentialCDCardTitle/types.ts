export interface SequentialCDCardTitleProps {
    isLatest: boolean
    isRunningOnParentCD: boolean
    // TODO: Check if it can be converted to enum
    artifactStatus: string
    environmentName: string
    parentEnvironmentName?: string
}
