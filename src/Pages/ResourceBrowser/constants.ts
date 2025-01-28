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

import { SelectPickerOptionType } from '@Shared/Components'
import { ReactComponent as ICMediumPlay } from '@Icons/ic-medium-play.svg'
import { ReactComponent as ICMediumPause } from '@Icons/ic-medium-pause.svg'
import { ReactComponent as ICCleanBrush } from '@Icons/ic-medium-clean-brush.svg'
import { NodeDrainRequest } from './types'

export const ALL_NAMESPACE_OPTION: Readonly<Pick<SelectPickerOptionType<string>, 'value' | 'label'>> = {
    value: 'all',
    label: 'All namespaces',
}

export const DRAIN_NODE_MODAL_MESSAGING = {
    DrainIcon: ICCleanBrush,
    GracePeriod: {
        heading: 'Grace period',
        infoText:
            'Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used.',
    },
    DeleteEmptyDirectoryData: {
        heading: 'Delete empty directory data',
        infoText: 'Enabling this field will delete the pods using empty directory data when the node is drained.',
    },
    DisableEviction: {
        heading: 'Disable eviction (use with caution)',
        infoText: `Enabling this field will force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets.
            Note: Make sure to use with caution.`,
    },
    ForceDrain: {
        heading: 'Force drain',
        infoText:
            'Enabling this field will force drain a node even if there are pods that do not declare a controller.',
    },
    IgnoreDaemonSets: {
        heading: 'Ignore DaemonSets',
        infoText: 'Enabling this field will ignore DaemonSet-managed pods.',
    },
    Actions: {
        infoText: 'Drain will cordon off the node and evict all pods of the node.',
        drain: 'Drain',
        draining: 'Draining node',
        cancel: 'Cancel',
    },
}

export const CORDON_NODE_MODAL_MESSAGING = {
    UncordonIcon: ICMediumPlay,
    CordonIcon: ICMediumPause,
    cordonInfoText:
        'Cordoning a node will mark it as unschedulable. By cordoning a node, you can be sure that no new pods will be scheduled on the node.',
    uncordonInfoText:
        'Uncordoning this node will mark this node as schedulable. By uncordoning a node, you will allow pods to be scheduled on this node.',
    cordon: 'Cordon',
    uncordon: 'Uncordon',
    cordoning: 'Cordoning node',
    uncordoning: 'Uncordoning node',
    cancel: 'Cancel',
}

export const NODE_DRAIN_OPTIONS_CHECKBOX_CONFIG: {
    key: Exclude<keyof NodeDrainRequest['nodeDrainOptions'], 'gracePeriodSeconds'>
    infoText: string
    label: string
}[] = [
    {
        key: 'deleteEmptyDirData',
        infoText: DRAIN_NODE_MODAL_MESSAGING.DeleteEmptyDirectoryData.infoText,
        label: DRAIN_NODE_MODAL_MESSAGING.DeleteEmptyDirectoryData.heading,
    },
    {
        key: 'disableEviction',
        infoText: DRAIN_NODE_MODAL_MESSAGING.DisableEviction.infoText,
        label: DRAIN_NODE_MODAL_MESSAGING.DisableEviction.heading,
    },
    {
        key: 'force',
        infoText: DRAIN_NODE_MODAL_MESSAGING.ForceDrain.infoText,
        label: DRAIN_NODE_MODAL_MESSAGING.ForceDrain.heading,
    },
    {
        key: 'ignoreAllDaemonSets',
        infoText: DRAIN_NODE_MODAL_MESSAGING.IgnoreDaemonSets.infoText,
        label: DRAIN_NODE_MODAL_MESSAGING.IgnoreDaemonSets.heading,
    },
] as const
