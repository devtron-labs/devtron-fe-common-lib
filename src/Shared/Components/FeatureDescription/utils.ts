import { ImageType } from '../../../Common'

export const getImageSize = (imageType: ImageType) => {
    switch (imageType) {
        case ImageType.SMALL:
            return { width: '100%', height: '200px' }
        default:
            return { width: '100%', height: '250px' }
    }
}
