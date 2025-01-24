import { SelectPickerOptionType } from '@Shared/Components'

export const ALL_NAMESPACE_OPTION: Readonly<Pick<SelectPickerOptionType<string>, 'value' | 'label'>> = {
    value: 'all',
    label: 'All namespaces',
}

export const DRAIN_NODE_MODAL_MESSAGING = {
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
        drain: 'Drain node',
        draining: 'Draining node',
        cancel: 'Cancel',
    },
}
