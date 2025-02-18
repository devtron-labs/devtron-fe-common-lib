import { GitProviderType } from '@Common/Constants'

import { IconsProps } from '../Icon'

export interface GitProviderIconProps {
    gitProvider: GitProviderType
    /**
     * The size of the icon in pixels.
     * @default 20
     */
    size?: IconsProps['size']
}
