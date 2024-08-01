import { PluginImageContainerProps } from './types'
import { ReactComponent as ICLegoBlock } from '../../../Assets/Icon/ic-lego-block.svg'
import { ImageWithFallback } from '../ImageWithFallback'

const PluginImageContainer = ({ imageProps, fallbackImageClassName }: PluginImageContainerProps) => (
    <ImageWithFallback
        fallbackImage={<ICLegoBlock className={`dc__no-shrink ${fallbackImageClassName}`} />}
        imageProps={imageProps}
    />
)

export default PluginImageContainer
