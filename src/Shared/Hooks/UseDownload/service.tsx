import { Host } from '@Common/Constants'

export const getDownloadResponse = (downloadUrl: string) => fetch(`${Host}/${downloadUrl}`)
