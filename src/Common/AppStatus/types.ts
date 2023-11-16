export interface AppStatusType {
    appStatus: string
    isDeploymentStatus?: boolean
    isJobView?: boolean
    isVirtualEnv?: boolean
    /**
     * Hide the status message if true and show status message in tooltip
     *
     * @default false
     */
    hideStatusMessage?: boolean
}
