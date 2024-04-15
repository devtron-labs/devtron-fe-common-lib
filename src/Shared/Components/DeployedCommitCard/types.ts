export interface DeployedCommitCardType {
    showCommitInfoDrawer: () => void
    cardLoading?: boolean
    envId: number | string
    ciArtifactId: number
}

export interface LoadingCardType {
    wider?: boolean
}
