/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

export interface DeploymentChartType extends Pick<DeploymentChartInfo, 'name'> {
    versions: DeploymentChartVersionsType[]
}

export enum DEVTRON_DEPLOYMENT_CHART_NAMES {
    JOB_AND_CRONJOB_CHART_NAME = 'Job & CronJob',
    ROLLOUT_DEPLOYMENT = 'Rollout Deployment',
    DEPLOYMENT = 'Deployment',
    STATEFUL_SET = 'StatefulSet',
}
