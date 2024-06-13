import { RegistryType } from '../../types'

export interface ImageChipCellProps {
    handleClick: () => void
    imagePath: string
    isExpanded: boolean
    registryType: RegistryType
}
