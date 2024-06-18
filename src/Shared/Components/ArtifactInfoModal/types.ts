import { ArtifactType } from '../CICDHistory'

export type ArtifactInfoModalProps = Pick<ArtifactType, 'renderCIListHeader'> & {
    ciArtifactId: number
    handleClose: () => void
} & (
        | {
              envId: number | string
              fetchOnlyArtifactInfo?: false
          }
        | {
              envId?: never
              /**
               * If true, the env and trigger meta data is not fetched
               */
              fetchOnlyArtifactInfo: true
          }
    )
