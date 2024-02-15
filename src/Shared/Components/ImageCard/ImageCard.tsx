import { ImageTagsContainer } from '../../../Common'
import { MaterialInfo } from './MaterialInfo'
import { SequentialCDCardTitle } from './SequentialCDCardTitle'
import { ImageCardProps } from './types'

const ImageCard = ({
    testIdLocator,
    cta,
    sequentialCDCardTitleProps,
    materialInfoProps,
    imageTagContainerProps,
}: ImageCardProps) => (
    <div className="material-history material-history--cd image-tag-parent-card">
        <div className="p-12 bcn-0 br-4">
            <div className="dc__content-start flexbox dc__align-start">
                <SequentialCDCardTitle {...sequentialCDCardTitleProps} />

                <div
                    data-testid={`cd-material-history-image-${testIdLocator}`}
                    className="material-history__top cursor-default"
                >
                    <MaterialInfo {...materialInfoProps} />
                </div>

                <div className="material-history__select-text fs-13 w-auto dc__no-text-transform flex right cursor-default">
                    {cta}
                </div>

                <div data-testid={`image-tags-container-${testIdLocator}`}>
                    <ImageTagsContainer {...imageTagContainerProps} />
                </div>
            </div>
        </div>
    </div>
)

export default ImageCard
