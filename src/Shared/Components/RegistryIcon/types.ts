import { RegistryType } from '@Shared/types'
import { IconsProps } from '../Icon'

export interface RegistryIconProps {
    registryType: RegistryType
    /**
     * The size of the icon in pixels.
     * @default 20
     */
    size?: IconsProps['size']
}
