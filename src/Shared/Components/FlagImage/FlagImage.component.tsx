import { FlagImage as FlagImageHelper } from 'react-international-phone'
import { FlagImageProps } from './types'

const FlagImage = ({ country, size }: FlagImageProps) => (
    <FlagImageHelper
        iso2={country}
        protocol={window.isSecureContext ? 'https' : 'http'}
        {...(size ? { size: `${size}px` } : {})}
    />
)

export default FlagImage
