import { CMSecretYamlData } from './app.types'

export const CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA: CMSecretYamlData[] = [{ k: '', v: '', id: 0 }]

export const configMapSecretMountDataMap = {
    environment: { title: 'Environment Variable', value: 'environment' },
    volume: { title: 'Data Volume', value: 'volume' },
}
