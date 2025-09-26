import { IconName } from '@Shared/Components'

import { ClusterProviderType } from './types'

export const CLUSTER_PROVIDER_TO_ICON_NAME: Record<ClusterProviderType, IconName | null> = {
    AWS: 'ic-aws',
    OTC: 'ic-otc-cloud',
    Azure: 'ic-azure',
    GCP: 'ic-google-cloud',
    Alibaba: 'ic-alibaba',
    Oracle: 'ic-oracle-cloud',
    Scaleway: null,
    DigitalOcean: null,
    Unknown: null,
}

export const CLUSTER_PROVIDER_TO_LABEL: Record<ClusterProviderType, string> = {
    AWS: 'AWS',
    OTC: 'OTC',
    Azure: 'Azure',
    GCP: 'GCP',
    Alibaba: 'Alibaba',
    Oracle: 'Oracle',
    Scaleway: 'Scaleway',
    DigitalOcean: 'DigitalOcean',
    Unknown: 'N/A',
}
