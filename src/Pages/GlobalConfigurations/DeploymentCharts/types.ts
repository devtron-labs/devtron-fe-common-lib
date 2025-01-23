interface DeploymentChartInfo {
    id: number
    chartDescription?: string
    isUserUploaded: boolean
    name: string
    version: string
    uploadedBy: string
}

export type DeploymentChartListDTO = DeploymentChartInfo[]

interface DeploymentChartVersionsType
    extends Pick<DeploymentChartInfo, 'id' | 'version' | 'uploadedBy' | 'isUserUploaded'> {
    description: string
}

export interface DeploymentChartType extends Pick<DeploymentChartInfo, 'name' | 'isUserUploaded'> {
    versions: DeploymentChartVersionsType[]
}

export enum DEVTRON_DEPLOYMENT_CHART_NAMES {
    JOB_AND_CRONJOB_CHART_NAME = 'Job & CronJob',
    ROLLOUT_DEPLOYMENT = 'Rollout Deployment',
    DEPLOYMENT = 'Deployment',
    STATEFUL_SET = 'StatefulSet',
}
