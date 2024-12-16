import { CMSecretExternalType } from '@Shared/index'

export const hasHashiOrAWS = (externalType: CMSecretExternalType): boolean =>
    externalType === CMSecretExternalType.AWSSecretsManager ||
    externalType === CMSecretExternalType.AWSSystemManager ||
    externalType === CMSecretExternalType.HashiCorpVault

export const hasESO = (externalType: CMSecretExternalType): boolean =>
    externalType === CMSecretExternalType.ESO_GoogleSecretsManager ||
    externalType === CMSecretExternalType.ESO_AzureSecretsManager ||
    externalType === CMSecretExternalType.ESO_AWSSecretsManager ||
    externalType === CMSecretExternalType.ESO_HashiCorpVault
