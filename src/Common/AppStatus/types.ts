export interface AppStatusType {
    appStatus: string
    isDeploymentStatus?: boolean
    isJobView?: boolean
    isVirtualEnv?: boolean
    /**
     * Hide the status message if true
     *
     * @default false
     */
    hideStatusMessage?: boolean
}
