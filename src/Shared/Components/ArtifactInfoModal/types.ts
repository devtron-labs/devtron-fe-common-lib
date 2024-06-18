import { ArtifactType } from '../CICDHistory'

export interface ArtifactInfoModalProps extends Pick<ArtifactType, 'renderCIListHeader'> {
    envId: number | string
    ciArtifactId: number
    handleClose: () => void
}
