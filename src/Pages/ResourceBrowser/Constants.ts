import { Nodes } from '../../Shared'
import { GVKType } from './ResourceBrowser.Types'

export const SIDEBAR_KEYS: {
    nodes: string
    events: string
    namespaces: string
    eventGVK: GVKType
    namespaceGVK: GVKType
    nodeGVK: GVKType
    overviewGVK: GVKType
} = {
    nodes: 'Nodes',
    events: 'Events',
    namespaces: 'Namespaces',
    eventGVK: {
        Group: '',
        Version: '',
        Kind: 'Event',
    },
    namespaceGVK: {
        Group: '',
        Version: '',
        Kind: 'Namespace',
    },
    nodeGVK: {
        Group: '',
        Version: '',
        Kind: 'Node' as Nodes,
    },
    overviewGVK: {
        Group: '',
        Version: '',
        Kind: Nodes.Overview as Nodes,
    },
}
