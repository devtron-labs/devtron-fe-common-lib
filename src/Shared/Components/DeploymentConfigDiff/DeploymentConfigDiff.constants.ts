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

import { FunctionComponent, SVGProps } from 'react'

import { ReactComponent as ICDiffFileUpdated } from '@Icons/ic-diff-file-updated.svg'
import { ReactComponent as ICDiffFileAdded } from '@Icons/ic-diff-file-added.svg'
import { ReactComponent as ICDiffFileRemoved } from '@Icons/ic-diff-file-removed.svg'

import { DeploymentConfigDiffState } from './DeploymentConfigDiff.types'

export const diffStateTextMap: Record<DeploymentConfigDiffState, string> = {
    hasDiff: 'Has difference',
    added: 'Added',
    deleted: 'Deleted',
    noDiff: 'No change',
}

export const diffStateIconMap: Record<DeploymentConfigDiffState, FunctionComponent<SVGProps<SVGSVGElement>>> = {
    hasDiff: ICDiffFileUpdated,
    added: ICDiffFileAdded,
    deleted: ICDiffFileRemoved,
    noDiff: null,
}

export const diffStateTooltipTextMap: Record<DeploymentConfigDiffState, string> = {
    hasDiff: 'File has difference',
    added: 'File has been added',
    deleted: 'File has been deleted',
    noDiff: null,
}

export const diffStateTextColorMap: Record<DeploymentConfigDiffState, `c${string}`> = {
    hasDiff: 'cy-7',
    added: 'cg-5',
    deleted: 'cr-5',
    noDiff: 'cn-7',
}

export const DEPLOYMENT_CONFIG_DIFF_SORT_KEY = 'sort-config'
