import { SyntheticEvent, useEffect, useState } from 'react'
import { ImageWithFallbackProps } from './types'

const ImageWithFallback = ({ imageProps, fallbackImage }: ImageWithFallbackProps) => {
    const [imageUrl, setImageUrl] = useState(imageProps.src)

    useEffect(() => {
        setImageUrl(imageProps.src)
    }, [imageProps.src])

    const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        if (fallbackImage && imageUrl) {
            setImageUrl(null)
        }

        if (imageProps.onError) {
            imageProps.onError(event)
        }
    }

    // If the type is string, the fallback image would be directly added to the img element
    return (
        // Added for type consistency
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {imageUrl || (!imageUrl && typeof fallbackImage === 'string') ? (
                <img alt="" {...imageProps} src={imageUrl || (fallbackImage as string)} onError={handleImageError} />
            ) : (
                fallbackImage
            )}
        </>
    )
}

export default ImageWithFallback
